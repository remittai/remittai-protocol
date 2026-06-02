/**
 * RemittAI ($RMTAI) Token Issuance on Stellar
 *
 * This script:
 * 1. Creates the issuer and distribution accounts (testnet only — uses friendbot)
 * 2. Establishes a trustline from distribution to issuer
 * 3. Issues 1,000,000,000 RMTAI tokens to the distribution account
 * 4. Sets authorization flags (AUTH_REQUIRED, AUTH_REVOCABLE, AUTH_CLAWBACK_ENABLED)
 * 5. Publishes asset metadata via home domain
 *
 * Usage:
 *   node scripts/issue-token.js --network testnet
 *   node scripts/issue-token.js --network mainnet
 */

import * as StellarSdk from "@stellar/stellar-sdk";
import dotenv from "dotenv";

dotenv.config();

const TOTAL_SUPPLY = "1000000000"; // 1 billion RMTAI
const ASSET_CODE = "RMTAI";

const NETWORK_CONFIG = {
  testnet: {
    horizon: "https://horizon-testnet.stellar.org",
    passphrase: StellarSdk.Networks.TESTNET,
    friendbot: "https://friendbot.stellar.org",
  },
  mainnet: {
    horizon: "https://horizon.stellar.org",
    passphrase: StellarSdk.Networks.PUBLIC,
    friendbot: null,
  },
};

function getNetwork() {
  const arg = process.argv.find((a) => a.startsWith("--network"));
  if (!arg) return "testnet";
  const network = process.argv[process.argv.indexOf("--network") + 1];
  return network === "mainnet" ? "mainnet" : "testnet";
}

async function fundTestnetAccount(publicKey) {
  console.log(`  Funding ${publicKey} via friendbot...`);
  const response = await fetch(
    `https://friendbot.stellar.org?addr=${publicKey}`
  );
  if (!response.ok) {
    throw new Error(`Friendbot funding failed: ${response.statusText}`);
  }
  console.log("  Funded successfully.");
}

async function main() {
  const network = getNetwork();
  const config = NETWORK_CONFIG[network];

  console.log(`\n=== RemittAI ($RMTAI) Token Issuance ===`);
  console.log(`Network: ${network}`);
  console.log(`Total Supply: ${TOTAL_SUPPLY} RMTAI\n`);

  const server = new StellarSdk.Horizon.Server(config.horizon);

  // --- Step 1: Create or load keypairs ---
  let issuerKeypair, distributionKeypair;

  if (process.env.ISSUER_SECRET_KEY && process.env.ISSUER_SECRET_KEY.startsWith("S")) {
    issuerKeypair = StellarSdk.Keypair.fromSecret(process.env.ISSUER_SECRET_KEY);
    distributionKeypair = StellarSdk.Keypair.fromSecret(process.env.DISTRIBUTION_SECRET_KEY);
    console.log("Loaded keypairs from .env");
  } else {
    issuerKeypair = StellarSdk.Keypair.random();
    distributionKeypair = StellarSdk.Keypair.random();
    console.log("Generated new keypairs:");
    console.log(`\n  ISSUER_SECRET_KEY=${issuerKeypair.secret()}`);
    console.log(`  ISSUER_PUBLIC_KEY=${issuerKeypair.publicKey()}`);
    console.log(`\n  DISTRIBUTION_SECRET_KEY=${distributionKeypair.secret()}`);
    console.log(`  DISTRIBUTION_PUBLIC_KEY=${distributionKeypair.publicKey()}`);
    console.log(`\n  >>> Save these to your .env file! <<<\n`);
  }

  const issuerPublic = issuerKeypair.publicKey();
  const distributionPublic = distributionKeypair.publicKey();

  // --- Step 2: Fund accounts (testnet only) ---
  if (network === "testnet") {
    console.log("Step 1: Funding accounts on testnet...");
    await fundTestnetAccount(issuerPublic);
    await fundTestnetAccount(distributionPublic);
  } else {
    console.log("Step 1: Verifying accounts exist on mainnet...");
    try {
      await server.loadAccount(issuerPublic);
      await server.loadAccount(distributionPublic);
      console.log("  Both accounts exist.");
    } catch {
      console.error("  ERROR: Accounts must be funded on mainnet before running this script.");
      console.error("  Send at least 5 XLM to each account.");
      process.exit(1);
    }
  }

  // --- Step 3: Define the RMTAI asset ---
  const rmtaiAsset = new StellarSdk.Asset(ASSET_CODE, issuerPublic);
  console.log(`\nStep 2: Asset defined — ${ASSET_CODE} issued by ${issuerPublic}`);

  // --- Step 4: Set authorization flags on issuer ---
  console.log("\nStep 3: Setting authorization flags on issuer...");
  const issuerAccount = await server.loadAccount(issuerPublic);

  const flagsTx = new StellarSdk.TransactionBuilder(issuerAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: config.passphrase,
  })
    .addOperation(
      StellarSdk.Operation.setOptions({
        setFlags:
          StellarSdk.AuthRequiredFlag |
          StellarSdk.AuthRevocableFlag |
          StellarSdk.AuthClawbackEnabledFlag,
      })
    )
    .setTimeout(180)
    .build();

  flagsTx.sign(issuerKeypair);
  await server.submitTransaction(flagsTx);
  console.log("  Authorization flags set: AUTH_REQUIRED, AUTH_REVOCABLE, AUTH_CLAWBACK_ENABLED");

  // --- Step 5: Create trustline from distribution to issuer ---
  console.log("\nStep 4: Creating trustline from distribution account...");
  const distributionAccount = await server.loadAccount(distributionPublic);

  const trustTx = new StellarSdk.TransactionBuilder(distributionAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: config.passphrase,
  })
    .addOperation(
      StellarSdk.Operation.changeTrust({
        asset: rmtaiAsset,
        limit: TOTAL_SUPPLY,
      })
    )
    .setTimeout(180)
    .build();

  trustTx.sign(distributionKeypair);
  await server.submitTransaction(trustTx);
  console.log("  Trustline established for RMTAI.");

  // --- Step 6: Authorize distribution account to hold RMTAI ---
  console.log("\nStep 5: Authorizing distribution account...");
  const issuerAccount2 = await server.loadAccount(issuerPublic);

  const authTx = new StellarSdk.TransactionBuilder(issuerAccount2, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: config.passphrase,
  })
    .addOperation(
      StellarSdk.Operation.setTrustLineFlags({
        trustor: distributionPublic,
        asset: rmtaiAsset,
        flags: {
          authorized: true,
        },
      })
    )
    .setTimeout(180)
    .build();

  authTx.sign(issuerKeypair);
  await server.submitTransaction(authTx);
  console.log("  Distribution account authorized.");

  // --- Step 7: Issue full supply to distribution account ---
  console.log("\nStep 6: Issuing tokens...");
  const issuerAccount3 = await server.loadAccount(issuerPublic);

  const issueTx = new StellarSdk.TransactionBuilder(issuerAccount3, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: config.passphrase,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination: distributionPublic,
        asset: rmtaiAsset,
        amount: TOTAL_SUPPLY,
      })
    )
    .setTimeout(180)
    .build();

  issueTx.sign(issuerKeypair);
  await server.submitTransaction(issueTx);
  console.log(`  Issued ${TOTAL_SUPPLY} RMTAI to distribution account.`);

  // --- Summary ---
  console.log("\n=== ISSUANCE COMPLETE ===");
  console.log(`Asset: ${ASSET_CODE}`);
  console.log(`Issuer: ${issuerPublic}`);
  console.log(`Distribution: ${distributionPublic}`);
  console.log(`Supply: ${TOTAL_SUPPLY} RMTAI`);
  console.log(`Network: ${network}`);
  console.log(`\nView on Stellar Expert:`);
  if (network === "testnet") {
    console.log(`  https://stellar.expert/explorer/testnet/asset/${ASSET_CODE}-${issuerPublic}`);
  } else {
    console.log(`  https://stellar.expert/explorer/public/asset/${ASSET_CODE}-${issuerPublic}`);
  }
  console.log(`\nNext steps:`);
  console.log(`  1. Run 'node scripts/setup-dex-offers.js' to create liquidity pools`);
  console.log(`  2. Run 'node scripts/lock-issuer.js' to permanently lock supply (IRREVERSIBLE)`);
  console.log(`  3. Publish stellar.toml at your domain for asset discovery`);
}

main().catch((err) => {
  console.error("Error:", err.message || err);
  process.exit(1);
});
