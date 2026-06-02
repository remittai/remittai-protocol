# RemittAI ($RMTAI)

**AI-powered remittance protocol on Stellar. Sub-1% fees. 5-second settlement. No bank account needed.**

> $800B is sent in remittances every year. The industry extracts $48B in fees from the world's poorest families. We're fixing that.

## What is RemittAI?

RemittAI is an AI-optimized remittance protocol built on [Stellar](https://stellar.org). Users send fiat, recipients receive fiat. Crypto is invisible middleware — like how Venmo users don't think about ACH.

**How it works:**
```
Sender pays USD (bank/card/mobile money)
  > Sending Anchor tokenizes to USDC on Stellar
    > AI Routing Engine finds cheapest path on Stellar DEX
      > Path Payment atomically converts USD > USDC > local currency
        > Receiving Anchor pays out local fiat
          > Recipient gets pesos/PHP/naira in 5 seconds
```

## Key Features

- **Sub-1% fees** — vs 6.2% industry average
- **5-second settlement** — vs 3-5 days for banks
- **AI routing** — Scans all DEX paths (order books + AMM pools) to maximize value
- **FX optimization** — ML models predict optimal send windows for recurring transfers
- **Fraud detection** — Real-time risk scoring (behavioral analysis, velocity checks, sanctions screening)
- **Mobile money payouts** — M-Pesa, GCash, Wave — serving the 1.4B unbanked
- **Compliance by design** — Stellar SEP-8 regulated asset controls, full KYC/AML

## Why Stellar?

| Feature | Benefit |
|---|---|
| Path Payments | Atomic multi-hop FX conversion in one transaction |
| Built-in DEX | Native order book + AMM — no external DEX needed |
| 5-second finality | Absolute, no block reorganizations |
| Sub-cent fees | ~$0.00001 per operation |
| Anchor framework | Standardized fiat on/off ramps (SEP-24, SEP-31) |
| Soroban contracts | Rust/WASM smart contracts for staking, governance, fees |
| Native USDC | Circle's USDC with deep institutional liquidity |

## Token: $RMTAI

| Parameter | Value |
|---|---|
| Network | Stellar |
| Total Supply | 1,000,000,000 (fixed, non-inflationary) |
| Launch Price | $0.020 |
| Issuer | Locked after minting — no additional supply possible |

**Utility:** Fee discounts (33% off when paying in $RMTAI) | Liquidity staking (5-12% APY) | AI oracle rewards | Governance | Burn (20% of protocol fees)

## Project Structure

```
remittai-protocol/
  scripts/           # Token issuance, DEX setup, issuer lock
    issue-token.js   # Issue 1B RMTAI on Stellar (testnet/mainnet)
    setup-dex-offers.js  # Create DEX liquidity pairs
    lock-issuer.js   # Permanently lock issuer account
  src/
    ai-router/       # AI routing engine (path scoring, fraud detection)
    stellar-toml/    # stellar.toml for asset discovery
  contracts/
    staking/         # Soroban staking contract (tiered: Bronze/Silver/Gold)
    fee-collector/   # Soroban fee collection + burn/distribute contract
  proposal/          # Full proposal docs (executive summary, tokenomics, roadmap, etc.)
  website/           # Landing page (deployed to remittai.com)
```

## Current Status

**Testnet live.** Building in public.

- [x] Token issued on Stellar testnet (1B RMTAI, auth flags set)
- [x] DEX liquidity created (RMTAI/USDC @ $0.02, RMTAI/XLM @ 0.08 XLM)
- [x] AI routing engine v1 (path scoring, fraud detection)
- [x] Soroban contracts written (staking + fee collector)
- [x] Landing page deployed (remittai.com)
- [ ] Soroban contracts deployed to testnet
- [ ] Anchor partnerships signed
- [ ] Mobile app beta
- [ ] Mainnet launch

## Running Locally

```bash
# Install dependencies
npm install

# Copy env and add your testnet keys
cp .env.example .env

# Issue token on testnet
npm run issue:testnet

# Set up DEX liquidity
npm run setup:dex

# Run AI router
npm run ai:route
```

## Testnet Assets

- **Token:** [RMTAI on Stellar Expert](https://stellar.expert/explorer/testnet/asset/RMTAI-GBEBPSRQCVC5ZVVHJSHKR37G2EL4F2Y6GIHAY4JD2WVG3KSKUNZSRNGB)
- **Issuer:** `GBEBPSRQCVC5ZVVHJSHKR37G2EL4F2Y6GIHAY4JD2WVG3KSKUNZSRNGB`
- **Distribution:** `GCDTLUMFMMPTB65ZARGO6KHZQ3ZZDBISP3RTHDZTVZS4LNVCHH3BJ2Q6`

## Links

- Website: [remittai.com](https://remittai.com)
- Twitter/X: [@REMITTai_](https://x.com/REMITTai_)
- Litepaper: [proposal/litepaper.md](proposal/litepaper.md)

## License

MIT
