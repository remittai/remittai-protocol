/**
 * Lock the RMTAI Issuer Account
 *
 * WARNING: This is IRREVERSIBLE. Once executed:
 * - No more RMTAI tokens can ever be minted
 * - The issuer account cannot sign any new transactions
 * - Authorization flags become permanent
 * - Supply is permanently fixed at 1,000,000,000 RMTAI
 *
 * Only run this AFTER:
 * - All tokens have been distributed to the correct accounts
 * - You've verified the total supply is correct
 * - You've set all authorization flags as desired
 * - You've published your stellar.toml
 *
 * Usage:
 *   node scripts/lock-issuer.js --confirm
 */

import * as StellarSdk from "@stellar/stellar-sdk";
import dotenv from "dotenv";
import readline from "readline";

dotenv.config();

async function main() {
  if (!process.argv.includes("--confirm")) {
    console.log("\n=== ISSUER LOCK SCRIPT ===");
    console.log("WARNING: This will PERMANENTLY lock the RMTAI issuer account.");
    console.log("No more tokens can EVER be created after this.");
    console.log("\nRun with --confirm to proceed.");
    process.exit(0);
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise((resolve) => {
    rl.question("\nType 'LOCK FOREVER' to confirm: ", resolve);
  });
  rl.close();

  if (answer !== "LOCK FOREVER") {
    console.log("Aborted.");
    process.exit(0);
  }

  const network = process.env.STELLAR_NETWORK || "testnet";
  const horizonUrl =
    network === "mainnet"
      ? "https://horizon.stellar.org"
      : "https://horizon-testnet.stellar.org";
  const passphrase =
    network === "mainnet" ? StellarSdk.Networks.PUBLIC : StellarSdk.Networks.TESTNET;

  const server = new StellarSdk.Horizon.Server(horizonUrl);
  const issuerKeypair = StellarSdk.Keypair.fromSecret(process.env.ISSUER_SECRET_KEY);
  const issuerAccount = await server.loadAccount(issuerKeypair.publicKey());

  console.log(`\nLocking issuer account: ${issuerKeypair.publicKey()}`);
  console.log(`Network: ${network}`);

  // Set all signer weights to 0 — account can never sign again
  const lockTx = new StellarSdk.TransactionBuilder(issuerAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: passphrase,
  })
    .addOperation(
      StellarSdk.Operation.setOptions({
        masterWeight: 0,
        lowThreshold: 0,
        medThreshold: 0,
        highThreshold: 0,
      })
    )
    .setTimeout(180)
    .build();

  lockTx.sign(issuerKeypair);
  await server.submitTransaction(lockTx);

  console.log("\n=== ISSUER LOCKED ===");
  console.log("The RMTAI supply is now permanently fixed at 1,000,000,000.");
  console.log("No new tokens can ever be minted.");
  console.log("This action is IRREVERSIBLE.");
}

main().catch((err) => {
  console.error("Error:", err.message || err);
  process.exit(1);
});
