/**
 * RemittAI — AI Routing Engine
 *
 * Finds the optimal path for a remittance transfer on Stellar's DEX.
 * Evaluates all available routes, scores them, and returns the best path.
 *
 * This is the core AI component that differentiates RemittAI from competitors.
 */

import * as StellarSdk from "@stellar/stellar-sdk";
import dotenv from "dotenv";

dotenv.config();

// Known anchors and their assets (expand as anchors are onboarded)
const KNOWN_ASSETS = {
  USDC: {
    mainnet: "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
    testnet: "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5",
  },
  // Add corridor-specific fiat tokens as anchors are onboarded:
  // PHP: { mainnet: "G...", testnet: "G..." },
  // MXN: { mainnet: "G...", testnet: "G..." },
  // NGN: { mainnet: "G...", testnet: "G..." },
};

export class AIRouter {
  constructor(network = "testnet") {
    const horizonUrl =
      network === "mainnet"
        ? "https://horizon.stellar.org"
        : "https://horizon-testnet.stellar.org";
    this.server = new StellarSdk.Horizon.Server(horizonUrl);
    this.network = network;
  }

  /**
   * Find the best payment path for a remittance transfer.
   *
   * @param {string} sourceAssetCode - Sender's currency (e.g., "USD", "USDC")
   * @param {string} sourceAssetIssuer - Issuer of source asset (null for XLM)
   * @param {string} destAssetCode - Recipient's currency (e.g., "PHP", "MXN")
   * @param {string} destAssetIssuer - Issuer of destination asset
   * @param {string} destAmount - Amount recipient should receive
   * @param {string} sourceAccount - Sender's Stellar public key
   * @returns {object} Best path with scoring details
   */
  async findBestPath(
    sourceAssetCode,
    sourceAssetIssuer,
    destAssetCode,
    destAssetIssuer,
    destAmount,
    sourceAccount
  ) {
    const sourceAsset =
      sourceAssetCode === "XLM"
        ? StellarSdk.Asset.native()
        : new StellarSdk.Asset(sourceAssetCode, sourceAssetIssuer);

    const destAsset =
      destAssetCode === "XLM"
        ? StellarSdk.Asset.native()
        : new StellarSdk.Asset(destAssetCode, destAssetIssuer);

    console.log(`\n--- AI Route Analysis ---`);
    console.log(`Send: ${sourceAssetCode} -> Receive: ${destAmount} ${destAssetCode}`);

    // Query Stellar's path finding API
    const paths = await this.server
      .strictReceivePaths(sourceAsset, destAsset, destAmount)
      .call();

    if (!paths.records || paths.records.length === 0) {
      console.log("No paths found. Checking fallback routes...");
      return this.findFallbackPath(sourceAsset, destAsset, destAmount);
    }

    // Score each path
    const scoredPaths = paths.records.map((path) => this.scorePath(path));

    // Sort by score (highest = best)
    scoredPaths.sort((a, b) => b.score - a.score);

    console.log(`\nFound ${scoredPaths.length} paths:\n`);
    scoredPaths.forEach((sp, i) => {
      const route = [sourceAssetCode, ...sp.path.map((a) => a.asset_code || "XLM"), destAssetCode];
      console.log(
        `  ${i + 1}. ${route.join(" > ")} | Cost: ${sp.sourceAmount} ${sourceAssetCode} | Score: ${sp.score.toFixed(2)} | Hops: ${sp.hops}`
      );
    });

    const best = scoredPaths[0];
    const bestRoute = [sourceAssetCode, ...best.path.map((a) => a.asset_code || "XLM"), destAssetCode];

    console.log(`\n  SELECTED: ${bestRoute.join(" > ")} (score: ${best.score.toFixed(2)})`);

    return {
      route: bestRoute,
      sourceAmount: best.sourceAmount,
      destAmount,
      hops: best.hops,
      score: best.score,
      path: best.path,
      estimatedFee: this.calculateProtocolFee(best.sourceAmount),
      raw: best.raw,
    };
  }

  /**
   * Score a path based on multiple factors.
   * Higher score = better path.
   */
  scorePath(path) {
    const sourceAmount = parseFloat(path.source_amount);
    const hops = path.path ? path.path.length : 0;

    // Factor 1: Cost efficiency (lower source amount = better)
    // Normalized: inverse of source amount (higher = cheaper)
    const costScore = 1 / sourceAmount * 100;

    // Factor 2: Hop penalty (fewer hops = less risk, faster)
    const hopPenalty = hops * 5;

    // Factor 3: Liquidity confidence
    // Paths through XLM or USDC get a boost (deeper liquidity)
    let liquidityBonus = 0;
    if (path.path) {
      for (const asset of path.path) {
        if (asset.asset_type === "native") liquidityBonus += 10; // XLM
        if (asset.asset_code === "USDC") liquidityBonus += 15; // USDC
      }
    }

    const score = costScore - hopPenalty + liquidityBonus;

    return {
      sourceAmount: path.source_amount,
      hops,
      path: path.path || [],
      score,
      costScore,
      hopPenalty,
      liquidityBonus,
      raw: path,
    };
  }

  /**
   * Fallback: route through USDC as intermediate when direct paths don't exist
   */
  async findFallbackPath(sourceAsset, destAsset, destAmount) {
    console.log("Attempting USDC fallback route...");

    const usdcIssuer = KNOWN_ASSETS.USDC[this.network];
    if (!usdcIssuer) {
      throw new Error("No USDC issuer configured for this network");
    }

    // Try: source -> USDC -> dest
    const usdcAsset = new StellarSdk.Asset("USDC", usdcIssuer);

    // Step 1: dest amount -> how much USDC needed?
    const leg2 = await this.server
      .strictReceivePaths(usdcAsset, destAsset, destAmount)
      .call();

    if (!leg2.records || leg2.records.length === 0) {
      throw new Error(
        `No path found: ${destAsset.code} has no liquidity against USDC. ` +
        `An anchor for ${destAsset.code} needs to be onboarded.`
      );
    }

    const usdcNeeded = leg2.records[0].source_amount;

    // Step 2: how much source needed -> USDC amount?
    const leg1 = await this.server
      .strictReceivePaths(sourceAsset, usdcAsset, usdcNeeded)
      .call();

    if (!leg1.records || leg1.records.length === 0) {
      throw new Error(`No path found from ${sourceAsset.code || "XLM"} to USDC`);
    }

    const totalSourceAmount = leg1.records[0].source_amount;

    console.log(`  Fallback route: ${sourceAsset.code || "XLM"} > USDC > ${destAsset.code}`);
    console.log(`  Cost: ${totalSourceAmount} ${sourceAsset.code || "XLM"}`);
    console.log(`  Via: ${usdcNeeded} USDC intermediate`);

    return {
      route: [sourceAsset.code || "XLM", "USDC", destAsset.code],
      sourceAmount: totalSourceAmount,
      destAmount,
      hops: 2,
      score: 50, // Fallback routes get a base score
      path: [usdcAsset],
      estimatedFee: this.calculateProtocolFee(totalSourceAmount),
      isFallback: true,
    };
  }

  /**
   * Calculate the RemittAI protocol fee
   */
  calculateProtocolFee(sourceAmount) {
    const amount = parseFloat(sourceAmount);
    const fiatFeeRate = 0.0075; // 0.75% for fiat payers
    const tokenFeeRate = 0.005; // 0.50% for $RMTAI payers

    return {
      fiatFee: (amount * fiatFeeRate).toFixed(4),
      tokenFee: (amount * tokenFeeRate).toFixed(4),
      savings: (amount * (fiatFeeRate - tokenFeeRate)).toFixed(4),
      fiatFeePercent: "0.75%",
      tokenFeePercent: "0.50%",
    };
  }

  /**
   * Analyze FX rate quality vs mid-market rate
   * (placeholder — would integrate real FX data feeds in production)
   */
  analyzeFXQuality(sourceAsset, destAsset, effectiveRate) {
    // In production, this compares the effective rate from Stellar DEX
    // against real-time mid-market rates from multiple FX data providers
    // (e.g., ECB, Reuters, XE.com APIs)
    return {
      effectiveRate,
      midMarketRate: "pending_oracle_integration",
      markup: "pending_oracle_integration",
      quality: "pending_oracle_integration",
    };
  }
}

/**
 * Fraud scoring engine (simplified version)
 * In production, this would use ML models trained on transaction patterns
 */
export class FraudScorer {
  /**
   * Score a transfer for fraud risk (0-100, higher = more risky)
   */
  score(transfer) {
    let riskScore = 0;
    const flags = [];

    // Amount-based checks
    if (transfer.amount > 10000) {
      riskScore += 20;
      flags.push("large_amount");
    }
    if (transfer.amount > 50000) {
      riskScore += 30;
      flags.push("very_large_amount");
    }

    // Velocity checks (would use historical data in production)
    if (transfer.transfersLast24h > 5) {
      riskScore += 25;
      flags.push("high_velocity");
    }

    // New corridor check
    if (transfer.isNewCorridor) {
      riskScore += 15;
      flags.push("new_corridor");
    }

    // Structuring check (amounts just below reporting thresholds)
    if (transfer.amount >= 2800 && transfer.amount <= 3000) {
      riskScore += 20;
      flags.push("possible_structuring_3k");
    }
    if (transfer.amount >= 9500 && transfer.amount <= 10000) {
      riskScore += 25;
      flags.push("possible_structuring_10k");
    }

    // First-time sender
    if (transfer.isFirstTransfer) {
      riskScore += 10;
      flags.push("first_transfer");
    }

    const decision =
      riskScore < 30
        ? "auto_approve"
        : riskScore < 70
          ? "additional_verification"
          : "manual_review";

    return {
      score: Math.min(riskScore, 100),
      decision,
      flags,
      recommendation:
        decision === "auto_approve"
          ? "Low risk — process immediately"
          : decision === "additional_verification"
            ? "Medium risk — request additional ID verification"
            : "High risk — hold for manual compliance review",
    };
  }
}

// --- CLI demo ---
async function demo() {
  console.log("=== RemittAI AI Router Demo ===\n");

  const router = new AIRouter("testnet");

  // Demo: Find best path from XLM to USDC
  try {
    const result = await router.findBestPath(
      "XLM", null,
      "USDC", KNOWN_ASSETS.USDC.testnet,
      "100", // receive 100 USDC
      null
    );

    console.log("\n--- Result ---");
    console.log(`Route: ${result.route.join(" > ")}`);
    console.log(`Send: ${result.sourceAmount} XLM`);
    console.log(`Receive: ${result.destAmount} USDC`);
    console.log(`Protocol fee (fiat): ${result.estimatedFee.fiatFee} XLM (${result.estimatedFee.fiatFeePercent})`);
    console.log(`Protocol fee (RMTAI): ${result.estimatedFee.tokenFee} XLM (${result.estimatedFee.tokenFeePercent})`);
    console.log(`You save: ${result.estimatedFee.savings} XLM by paying with $RMTAI`);
  } catch (err) {
    console.log(`Path finding error: ${err.message}`);
    console.log("(This is expected on testnet if liquidity pools are empty)");
  }

  // Demo: Fraud scoring
  console.log("\n\n=== Fraud Scorer Demo ===\n");
  const scorer = new FraudScorer();

  const scenarios = [
    { amount: 200, transfersLast24h: 1, isNewCorridor: false, isFirstTransfer: false, label: "Normal $200 transfer" },
    { amount: 9800, transfersLast24h: 3, isNewCorridor: true, isFirstTransfer: false, label: "$9,800 to new corridor" },
    { amount: 2950, transfersLast24h: 8, isNewCorridor: false, isFirstTransfer: true, label: "$2,950 first transfer, high velocity" },
  ];

  for (const scenario of scenarios) {
    const result = scorer.score(scenario);
    console.log(`${scenario.label}:`);
    console.log(`  Risk: ${result.score}/100 | Decision: ${result.decision}`);
    console.log(`  Flags: ${result.flags.join(", ") || "none"}`);
    console.log(`  ${result.recommendation}\n`);
  }
}

// Run demo if called directly
const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"));
if (isMain || process.argv.includes("--demo")) {
  demo();
}
