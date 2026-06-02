# RemittAI ($RMTAI)
## AI-Powered Remittances on Stellar
### Litepaper v1.0 | June 2026

---

## The Problem

Every year, $800 billion is sent across borders by migrant workers and diaspora communities. The industry extracts $48 billion in fees from the world's poorest families.

- **Average fee:** 6.2% to send $200 (UN target: 3%)
- **Hidden costs:** Providers mark up exchange rates 2-4% on top of stated fees
- **Speed:** Bank wires take 3-5 days. Even "fast" services hold funds 24-48 hours
- **Exclusion:** 1.4 billion adults have no bank account. The people who need remittances most are the least served

Western Union, MoneyGram, and banks profit from opacity. Fintech alternatives (Wise, Remitly) improved pricing but still run on slow banking rails. Previous crypto attempts (Ripple, Celo, Bitcoin) failed because they required users to understand blockchain or bear volatility risk.

**The gap:** No solution combines instant settlement, sub-1% fees, AI optimization, and mobile money access for the unbanked — until now.

---

## The Solution

RemittAI is an AI-powered remittance protocol built on Stellar.

**For the sender:** Open the app. Enter the amount. Enter the recipient's phone number. See exactly what they'll receive. Hit send.

**For the recipient:** Get paid in 5 seconds. To their mobile money account, bank, or cash pickup point.

**What happens underneath (invisible to the user):**

```
Sender pays USD (bank/card/mobile money)
    |
    v
Sending Anchor converts to tokenized USD on Stellar
    |
    v
AI Routing Engine finds the cheapest path across Stellar's DEX
    |
    v
Path Payment atomically converts USD > USDC > local currency
    |
    v
Receiving Anchor pays out local fiat
    |
    v
Recipient receives pesos/PHP/naira in 5 seconds
```

**The user never touches crypto.** Blockchain is invisible infrastructure — like how Venmo users don't think about ACH.

---

## Why Stellar

Stellar was purpose-built for cross-border payments. No other blockchain offers this combination:

| Feature | What It Does for RemittAI |
|---|---|
| **Path Payments** | Atomic multi-currency conversion in one transaction (e.g., USD > XLM > USDC > PHP). No partial fills, no counterparty risk |
| **Built-in DEX** | Native order book + AMM pools. No need to deploy Uniswap-style contracts |
| **5-second finality** | Absolute — no block reorganizations, no probabilistic waiting |
| **Sub-cent fees** | 0.00001 XLM per operation. A remittance costs fractions of a penny in network fees |
| **Anchor framework** | Standardized fiat on/off ramps (SEP-24, SEP-31) with built-in KYC flows |
| **Compliance tools** | AUTH_REQUIRED, AUTH_REVOCABLE, clawback — regulatory compliance at the protocol level |
| **Soroban contracts** | Rust/WASM smart contracts for custom logic (staking, governance, fee collection) |
| **USDC native** | Circle's USDC is natively issued on Stellar with deep liquidity |

---

## The AI Layer

AI is not a buzzword bolted onto a token. It is the core product differentiator.

### Smart Routing
Every transfer is optimized in real-time. The AI scans all available paths on Stellar's DEX — order books, AMM pools, multi-hop routes — and selects the one that delivers the most value to the recipient. Runs in under 100ms.

### FX Optimization
For recurring senders (monthly family support), the AI learns optimal send windows based on historical FX patterns. Users get alerts when rates are favorable. Large transfers can be split across time windows to reduce market impact.

### Fraud Detection
Every transaction receives a risk score (0-100) based on behavioral analysis, velocity checks, network graph analysis, and real-time sanctions screening. Low-risk transfers settle instantly. High-risk transfers are flagged for review.

### Liquidity Prediction
The AI predicts corridor demand patterns (payday spikes, holiday surges) and directs liquidity providers to pre-position capital where it's needed, reducing slippage during high-volume periods.

---

## The Token: $RMTAI

| Parameter | Value |
|---|---|
| Name | RemittAI |
| Ticker | $RMTAI |
| Network | Stellar |
| Total Supply | 1,000,000,000 (fixed, non-inflationary) |
| Launch Price | $0.020 |

### Distribution

| Allocation | % | Vesting |
|---|---|---|
| Public Sale | 30% | Immediate |
| Liquidity Provision | 20% | 10% at TGE, linear over 24 months |
| Team & Founders | 15% | 12-month cliff + 36-month linear |
| Ecosystem & Grants | 15% | Governance-voted over 48 months |
| AI Development Fund | 10% | Linear over 36 months |
| Treasury | 5% | 6-month cliff, governance-controlled |
| Advisors | 5% | 6-month cliff + 24-month linear |

### Token Utility

1. **Fee Discounts** — Pay remittance fees in $RMTAI for 33% off (0.50% vs 0.75%)
2. **Liquidity Staking** — Stake $RMTAI to provide corridor liquidity and earn protocol fees (5-12% APY)
3. **AI Oracle Rewards** — AI agents that serve FX feeds, routing, and fraud scoring earn $RMTAI
4. **Governance** — Vote on corridor expansion, fee structures, grant allocations
5. **Burn** — 20% of protocol fee revenue buys back and burns $RMTAI permanently

### Value Flywheel

More remittance volume > more fees collected > more $RMTAI burned + more staking rewards > reduced supply + increased demand > better liquidity attracts more volume > flywheel accelerates

---

## Market Opportunity

| Metric | Value |
|---|---|
| Global remittance market | $800B+/year |
| Fees extracted annually | ~$48B |
| Unbanked adults globally | 1.4 billion |
| Mobile money accounts | 1.75 billion |
| UN SDG fee target | <3% (current avg: 6.2%) |

### Target Corridors

| Corridor | Annual Volume | Current Fees | Our Fee |
|---|---|---|---|
| US > Philippines | $38B | 5-7% | <1% |
| US > Mexico | $63B | 4-6% | <1% |
| UK > Nigeria | $25B | 6-10% | <1% |
| Gulf > India/Pakistan | $50B | 4-6% | <1% |
| Intra-Africa | $20B | 8-15% | <1% |

Even capturing 0.01% of global remittance volume = $80M in annual throughput = $520K+ in protocol revenue.

---

## Competitive Edge

| vs. | Our Advantage |
|---|---|
| **Western Union / MoneyGram** | 10-50x cheaper, 1000x faster, no physical infrastructure costs |
| **Wise / Remitly** | Seconds vs. days. Mobile money payouts for unbanked |
| **Remittix ($RTX)** | Stellar (sub-cent tx) vs. Ethereum ($1-20 gas). AI optimization. Fiat-to-fiat (not crypto-to-fiat). Mobile money integration |
| **Ripple ($XRP)** | Consumer-facing vs. bank-facing. No regulatory baggage |
| **Raw stablecoins (USDT/USDC)** | No crypto knowledge required. Integrated KYC, fiat off-ramps, fraud protection |

---

## Roadmap

### Phase 0 — Foundation (Months 1-3)
- Legal entity + token opinion letter
- $RMTAI token issued on Stellar
- Soroban smart contracts developed and audited
- AI routing engine v1 on testnet
- Anchor partnerships signed (minimum 2)
- Whitepaper published

### Phase 1 — Launch (Months 4-6)
- Token presale ($4M target across 3 rounds)
- Mainnet deployment
- First corridor live (US > Philippines or US > Mexico)
- Mobile app beta (iOS + Android)
- Staking portal live
- First CEX listing

### Phase 2 — Growth (Months 7-12)
- Expand to 5-8 corridors
- Mobile money integrations (M-Pesa, GCash, Wave)
- AI FX optimizer and fraud engine v2
- Enterprise API beta (B2B remittance-as-a-service)
- Target: $10M/month transfer volume

### Phase 3 — Scale (Months 13-18)
- 10-15 active corridors
- Enterprise API general availability
- DAO governance transition
- Protocol self-sustaining on fee revenue
- Target: $50-100M/month transfer volume

---

## Presale Structure

| Round | Tokens | Price | Raise | Discount vs Launch |
|---|---|---|---|---|
| Seed | 45,000,000 | $0.008 | $360,000 | 60% |
| Early | 90,000,000 | $0.012 | $1,080,000 | 40% |
| Public | 165,000,000 | $0.016 | $2,640,000 | 20% |
| **Total** | **300,000,000** | — | **$4,080,000** | — |
| Launch | — | $0.020 | — | — |

---

## Why Now

- **Stellar's Soroban** (2024) enables custom AI logic on a payments-optimized chain for the first time
- **USDC on Stellar** provides deep, institutional-grade settlement liquidity
- **AI + crypto** is the dominant narrative of 2024-2026
- **Remittix validated demand** ($30M+ raised for crypto remittances) but built on the wrong chain with no AI
- **SDF actively funds** remittance projects through grants and the Enterprise Fund
- **Regulatory clarity improving** — MiCA in EU, stablecoin bills advancing in US

---

## Team

[To be completed — key roles needed:]
- **Founder / CEO** — Vision, fundraising, partnerships
- **Stellar Developer** — Token issuance, Soroban contracts, anchor integrations
- **AI/ML Engineer** — Routing engine, FX models, fraud detection
- **Business Development** — Anchor partnerships, corridor expansion, mobile money integrations
- **Legal / Compliance** — Token classification, money transmitter licensing

---

## Links

- Website: [remittai.io] — *to be registered*
- Twitter/X: [@REMITTai_](https://x.com/REMITTai_)
- Discord: [discord.gg/remittai] — *to be created*
- GitHub: [github.com/remittai] — *to be created*
- Stellar Asset: [stellar.expert/asset/RMTAI] — *to be issued*

---

## Contact

[Founder contact information to be added]

---

*This document is for informational purposes only and does not constitute financial advice or an offer to sell securities. $RMTAI is a utility token designed to power the RemittAI protocol. Prospective participants should conduct their own due diligence and consult legal and financial advisors.*

---

**RemittAI — Because your family deserves better than 6% fees.**
