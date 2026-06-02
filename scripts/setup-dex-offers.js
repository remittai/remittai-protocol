/**
 * Set up initial DEX liquidity for RMTAI
 *
 * Creates sell offers on Stellar's native DEX:
 * - RMTAI/USDC pair (primary trading pair)
 * - RMTAI/XLM pair (secondary trading pair)
 *
 * Usage:
 *   node scripts/setup-dex-offers.js
 */

import * as StellarSdk from "@stellar/stellar-sdk";
import dotenv from "dotenv";

dotenv.config();

// Initial DEX pricing at launch ($0.02 per RMTAI)
const RMTAI_USDC_PRICE = "0.02"; // 1 RMTAI = $0.02 USDC
const RMTAI_XLM_PRICE = "0.08"; // 1 RMTAI = 0.08 XLM (assuming XLM ~$0.25)

// Initial liquidity amounts
const RMTAI_FOR_USDC_POOL = "5000000"; // 5M RMTAI for USDC pair
const RMTAI_FOR_XLM_POOL = "5000000"; // 5M RMTAI for XLM pair

async function main() {
  const network = process.env.STELLAR_NETWORK || "testnet";
  const horizonUrl =
    network === "mainnet"
      ? "https://horizon.stellar.org"
      : "https://horizon-testnet.stellar.org";
  const passphrase =
    network === "mainnet" ? StellarSdk.Networks.PUBLIC : StellarSdk.Networks.TESTNET;

  const server = new StellarSdk.Horizon.Server(horizonUrl);
  const distributionKeypair = StellarSdk.Keypair.fromSecret(
    process.env.DISTRIBUTION_SECRET_KEY
  );
  const issuerPublic = StellarSdk.Keypair.fromSecret(
    process.env.ISSUER_SECRET_KEY
  ).publicKey();

  const rmtaiAsset = new StellarSdk.Asset("RMTAI", issuerPublic);

  // USDC issuer on Stellar (Circle's official issuer)
  const USDC_ISSUER =
    network === "mainnet"
      ? "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN" // Circle mainnet
      : "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5"; // Testnet USDC
  const usdcAsset = new StellarSdk.Asset("USDC", USDC_ISSUER);

  console.log("\n=== Setting Up DEX Liquidity ===");
  console.log(`Network: ${network}`);
  console.log(`Distribution: ${distributionKeypair.publicKey()}`);

  // Load distribution account
  const account = await server.loadAccount(distributionKeypair.publicKey());

  // Ensure USDC trustline exists
  console.log("\nStep 1: Ensuring USDC trustline...");
  const hasTrustline = account.balances.some(
    (b) => b.asset_code === "USDC" && b.asset_issuer === USDC_ISSUER
  );

  if (!hasTrustline) {
    const trustTx = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: passphrase,
    })
      .addOperation(StellarSdk.Operation.changeTrust({ asset: usdcAsset }))
      .setTimeout(180)
      .build();
    trustTx.sign(distributionKeypair);
    await server.submitTransaction(trustTx);
    console.log("  USDC trustline created.");
  } else {
    console.log("  USDC trustline already exists.");
  }

  // Create RMTAI/USDC sell offer
  console.log("\nStep 2: Creating RMTAI/USDC sell offer...");
  const account2 = await server.loadAccount(distributionKeypair.publicKey());

  const usdcOfferTx = new StellarSdk.TransactionBuilder(account2, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: passphrase,
  })
    .addOperation(
      StellarSdk.Operation.manageSellOffer({
        selling: rmtaiAsset,
        buying: usdcAsset,
        amount: RMTAI_FOR_USDC_POOL,
        price: RMTAI_USDC_PRICE,
      })
    )
    .setTimeout(180)
    .build();

  usdcOfferTx.sign(distributionKeypair);
  await server.submitTransaction(usdcOfferTx);
  console.log(`  Sell offer: ${RMTAI_FOR_USDC_POOL} RMTAI at ${RMTAI_USDC_PRICE} USDC each`);

  // Create RMTAI/XLM sell offer
  console.log("\nStep 3: Creating RMTAI/XLM sell offer...");
  const account3 = await server.loadAccount(distributionKeypair.publicKey());

  const xlmOfferTx = new StellarSdk.TransactionBuilder(account3, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: passphrase,
  })
    .addOperation(
      StellarSdk.Operation.manageSellOffer({
        selling: rmtaiAsset,
        buying: StellarSdk.Asset.native(),
        amount: RMTAI_FOR_XLM_POOL,
        price: RMTAI_XLM_PRICE,
      })
    )
    .setTimeout(180)
    .build();

  xlmOfferTx.sign(distributionKeypair);
  await server.submitTransaction(xlmOfferTx);
  console.log(`  Sell offer: ${RMTAI_FOR_XLM_POOL} RMTAI at ${RMTAI_XLM_PRICE} XLM each`);

  console.log("\n=== DEX Liquidity Setup Complete ===");
  console.log(`RMTAI/USDC: ${RMTAI_FOR_USDC_POOL} RMTAI @ $${RMTAI_USDC_PRICE}`);
  console.log(`RMTAI/XLM: ${RMTAI_FOR_XLM_POOL} RMTAI @ ${RMTAI_XLM_PRICE} XLM`);
  console.log(`\nView orderbook:`);
  console.log(`  https://stellar.expert/explorer/${network === "mainnet" ? "public" : "testnet"}/asset/${rmtaiAsset.code}-${issuerPublic}#trade`);
}

main().catch((err) => {
  console.error("Error:", err.message || err);
  process.exit(1);
});
