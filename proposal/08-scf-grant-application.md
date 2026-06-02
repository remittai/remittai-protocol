# Stellar Community Fund — Build Award Application
# RemittAI ($RMTAI): AI-Powered Remittance Protocol

---

## PROJECT OVERVIEW

### Project Name
RemittAI

### One-Line Description
An AI-powered remittance protocol on Stellar that uses path payments, Soroban smart contracts, and machine learning to deliver sub-1% fee cross-border transfers with mobile money payouts in under 10 seconds.

### Project Category
Payments / Cross-Border Remittances / DeFi Infrastructure

### Requested Amount
$150,000 USD (in XLM)

### Project Timeline
6 months

---

## PROBLEM STATEMENT

The global remittance market exceeds $800 billion annually, yet the average cost to send $200 cross-border remains 6.2% — more than double the UN Sustainable Development Goal target of 3%. This means approximately $48 billion per year is extracted in fees from the world's poorest communities.

Current solutions fail across three dimensions:

1. **Traditional providers** (Western Union, MoneyGram) charge 5-10% with hidden FX markups and multi-day settlement
2. **Fintech alternatives** (Wise, Remitly) reduced fees to 1-3% but still depend on slow banking rails (1-3 days)
3. **Crypto attempts** (Ripple, stablecoins) either target institutions instead of consumers, require crypto literacy, or lack fiat off-ramps in key corridors

No existing solution combines instant settlement, sub-1% fees, AI-optimized routing, and mobile money access for the 1.4 billion unbanked adults globally.

---

## SOLUTION: HOW REMITTAI WORKS

RemittAI is a remittance protocol where the user sends fiat and the recipient receives fiat — blockchain is invisible middleware.

### Transfer Flow
1. Sender opens RemittAI app, enters amount and recipient's phone number
2. Sending Anchor accepts fiat (bank transfer, card, mobile money) and issues tokenized fiat on Stellar
3. AI Routing Engine queries Stellar's DEX to find the optimal path payment route
4. Path payment executes atomically (e.g., USD > USDC > XLM > PHP) in one transaction
5. Receiving Anchor converts to local fiat and pays out via mobile money, bank deposit, or cash agent
6. Recipient receives funds in ~5-7 seconds

### AI Layer (Core Differentiator)
- **Smart Routing:** Evaluates all available paths on Stellar's DEX (order books + AMM pools), scores by cost efficiency, liquidity depth, and hop count, selects the route that delivers maximum value to the recipient. Runs in <100ms.
- **FX Optimization:** For recurring senders, the AI learns optimal send windows based on historical FX volatility patterns and notifies users when rates are favorable.
- **Fraud Detection:** Every transfer receives a risk score (0-100) based on behavioral analysis, velocity checks, network graph analysis, and sanctions screening. Low-risk transfers auto-approve; high-risk transfers are held for review.
- **Liquidity Prediction:** Predicts corridor demand patterns (payday spikes, holiday surges) to pre-position liquidity and reduce slippage.

---

## STELLAR INTEGRATION (TECHNICAL ARCHITECTURE)

Stellar is not a superficial integration — it is the core infrastructure that makes RemittAI possible. No other blockchain provides this combination of capabilities for remittances:

### Classic Stellar Operations Used

| Operation | Purpose in RemittAI |
|---|---|
| `pathPaymentStrictReceive` | Atomic multi-hop FX conversion — guarantees exact receive amount |
| `manageSellOffer` | Market makers provide corridor liquidity on Stellar's native DEX |
| `changeTrust` | Users opt into $RMTAI and corridor-specific fiat tokens |
| `setOptions` | Compliance flags (AUTH_REQUIRED, AUTH_REVOCABLE, AUTH_CLAWBACK_ENABLED) on $RMTAI |
| `setTrustLineFlags` | KYC-gated authorization — only verified users can hold $RMTAI |
| `clawback` | Regulatory compliance — respond to court orders, fraud, sanctions violations |

### Soroban Smart Contracts (4 contracts, all will be open-sourced)

| Contract | Function | Status |
|---|---|---|
| `rmtai-staking` | Tiered liquidity provider staking (Bronze/Silver/Gold), reward calculation, 7-day lock period | Written, ready for testnet |
| `rmtai-fee-collector` | Protocol fee collection (0.50-0.75%), automated distribution (20% burn, 40% staking, 30% treasury, 10% AI fund) | Written, ready for testnet |
| `rmtai-governance` | On-chain voting for corridor expansion, fee changes, grant allocations | To be built in Tranche 2 |
| `rmtai-escrow` | Conditional transfers for compliance holds and dispute resolution | To be built in Tranche 2 |

### SEP Standards Implemented

| SEP | Purpose |
|---|---|
| SEP-1 | stellar.toml for asset discovery (drafted) |
| SEP-10 | Web authentication (user <> anchor mutual auth) |
| SEP-12 | KYC data submission to anchors |
| SEP-24 | Interactive deposit/withdrawal flows |
| SEP-31 | Cross-border payment API (anchor-to-anchor settlement) |
| SEP-8 | Regulated asset approval (compliance engine approves every transfer) |

### Why Stellar Over Alternatives

| Requirement | Stellar | Ethereum | Solana |
|---|---|---|---|
| Atomic multi-hop FX | Native path payments | Requires custom DEX aggregator | Requires custom DEX aggregator |
| Transaction cost | $0.00001 | $1-20+ | $0.001-0.01 |
| Finality | 5-7 sec, absolute | 12 min+ for safety | 400ms, but reorgs possible |
| Fiat on/off ramps | Native anchor framework (SEP-24/31) | No standard | No standard |
| Compliance tools | AUTH flags, clawback, SEP-8 built in | Requires custom contract logic | Requires custom contract logic |
| Stablecoin settlement | USDC native (Circle) | USDC native | USDC native |

Path payments are Stellar's killer feature for remittances — no other chain can atomically convert through multiple currencies in a single transaction with guaranteed receive amounts.

---

## PRODUCT READINESS & TRACTION

### What's Already Built
- $RMTAI token issued on Stellar testnet (1B supply, AUTH_REQUIRED + AUTH_REVOCABLE + CLAWBACK flags set)
- DEX liquidity pools created (RMTAI/USDC and RMTAI/XLM pairs on testnet)
- AI Routing Engine v1 functional — queries Stellar Horizon `/paths` API, scores routes by cost/hops/liquidity, selects optimal path
- Fraud scoring engine with behavioral analysis, velocity checks, and structuring detection
- Soroban staking contract written in Rust (tiered rewards, lock periods, claim mechanism)
- Soroban fee collector contract written in Rust (fee collection, burn/staking/treasury distribution)
- stellar.toml drafted and ready for domain hosting
- Full proposal package: litepaper, tokenomics, competitive analysis, go-to-market strategy

### Testnet Links
- Token: [View on Stellar Expert](https://stellar.expert/explorer/testnet/asset/RMTAI-GBEBPSRQCVC5ZVVHJSHKR37G2EL4F2Y6GIHAY4JD2WVG3KSKUNZSRNGB)
- Issuer: GBEBPSRQCVC5ZVVHJSHKR37G2EL4F2Y6GIHAY4JD2WVG3KSKUNZSRNGB
- Distribution: GCDTLUMFMMPTB65ZARGO6KHZQ3ZZDBISP3RTHDZTVZS4LNVCHH3BJ2Q6

### Validated Market Need
- $800B+ global remittance market with 6.2% average fees (World Bank)
- Competitor Remittix ($RTX) raised $30M+ in presale for crypto-to-fiat remittances on Ethereum — validating massive investor appetite for this category
- Remittix built on Ethereum (expensive gas), has no AI, and requires senders to already hold crypto. RemittAI addresses all three gaps
- SDF's own MoneyGram Access partnership demonstrated Stellar's viability as remittance infrastructure

---

## TEAM

### Core Team

**[Founder Name] — Project Lead**
- [Background in fintech/crypto/payments]
- Responsible for: Strategy, partnerships, fundraising, anchor relationships

**Stellar/Soroban Developer**
- Experienced in Rust, Soroban SDK, Stellar SDK (JavaScript)
- Responsible for: Smart contract development, token issuance, SEP integration, testnet/mainnet deployment

**AI/ML Engineer**
- Experienced in Python, machine learning, financial data modeling
- Responsible for: AI routing engine, FX optimization models, fraud detection, oracle infrastructure

**Business Development**
- Experienced in fintech partnerships, mobile money ecosystems
- Responsible for: Anchor onboarding, mobile money integrations, corridor expansion

### Commitment
All team members are prepared to begin full-time development immediately upon award acceptance. The technical architecture is complete, Soroban contracts are written, and the testnet deployment is live.

---

## BUDGET & DELIVERABLES

### Budget Summary

| Category | Amount | % |
|---|---|---|
| Smart contract development & testing | $45,000 | 30% |
| AI routing engine & fraud detection | $30,000 | 20% |
| Backend infrastructure (SEP servers, Horizon indexing, API) | $25,000 | 17% |
| Frontend development (mobile app + web) | $25,000 | 17% |
| Anchor integration & testnet/mainnet deployment | $15,000 | 10% |
| QA, testing, documentation | $10,000 | 6% |
| **Total** | **$150,000** | **100%** |

*Note: Audit costs excluded per SCF guidelines (will apply separately to Soroban Audit Bank). Marketing, legal, and entity costs excluded per SCF rules.*

---

### Tranche #0 — Award Acceptance (10% = $15,000)
**Disbursed immediately upon acceptance**

Used for: Initial infrastructure setup, developer onboarding, testnet environment preparation.

---

### Tranche #1 — MVP (20% = $30,000)
**Timeline: Weeks 1-8**

**Objective:** Functional MVP demonstrating AI-optimized remittance on Stellar testnet with complete smart contract suite.

| # | Deliverable | Verification Method |
|---|---|---|
| 1.1 | Soroban staking contract deployed to testnet with unit tests passing | Contract address on testnet; test results in public GitHub repo |
| 1.2 | Soroban fee collector contract deployed to testnet with unit tests passing | Contract address on testnet; test results in public GitHub repo |
| 1.3 | AI routing engine v2: queries Horizon paths API, scores routes across 3+ factors (cost, hops, liquidity depth), selects optimal path, returns result in <200ms | Public API endpoint on testnet; demo video showing route comparison |
| 1.4 | Fraud scoring engine processing test transactions with documented accuracy metrics | Test suite with 50+ test scenarios; accuracy report published |
| 1.5 | Basic web UI allowing users to simulate a remittance transfer (input amount, select corridor, see AI-selected route, view fee breakdown) | Live testnet URL accessible by reviewers |
| 1.6 | SEP-10 authentication flow integrated with test anchor | Functional auth flow demonstrable by reviewers |

**Success Criteria:**
- All 4 Soroban contracts compile, deploy, and pass tests on Stellar testnet
- AI router consistently selects optimal path across 10+ test scenarios (verified by comparing against manual path analysis)
- End-to-end simulated transfer completes on testnet in <15 seconds
- All code open-sourced on GitHub with documentation

---

### Tranche #2 — Testnet Expansion (30% = $45,000)
**Timeline: Weeks 9-16**

**Objective:** Full protocol functionality on testnet with governance, anchor integration, and mobile app.

| # | Deliverable | Verification Method |
|---|---|---|
| 2.1 | Soroban governance contract deployed to testnet (proposal creation, voting, execution) | Contract address; demo of proposal lifecycle |
| 2.2 | Soroban escrow contract deployed to testnet (conditional holds, compliance releases) | Contract address; test suite |
| 2.3 | SEP-24 interactive deposit/withdrawal flow integrated with at least 1 test anchor | Functional deposit/withdrawal demonstrable by reviewers |
| 2.4 | SEP-31 cross-border payment API integrated for at least 1 test corridor | API endpoint; documented request/response flow |
| 2.5 | AI FX optimization module: analyzes historical rate data, recommends optimal send windows for recurring transfers | Module with backtesting results on 90+ days of historical data |
| 2.6 | Mobile app (React Native) on iOS TestFlight + Android APK: send/receive, view history, staking interface | Downloadable app; reviewers can test full flow |
| 2.7 | Liquidity provider staking interface: stake $RMTAI, view tier, claim rewards, view corridor assignments | Functional UI connected to Soroban staking contract on testnet |
| 2.8 | Public metrics dashboard: transfer volume, fees collected, tokens burned, staking TVL | Live dashboard URL with real-time testnet data |

**Success Criteria:**
- Governance contract supports full proposal lifecycle (create > vote > pass/fail > execute)
- At least 1 anchor integration functional on testnet with SEP-24 deposit flow
- Mobile app can complete a simulated end-to-end transfer on testnet
- AI FX optimizer demonstrates measurable improvement over naive timing (backtested)
- All contracts open-sourced with developer documentation

---

### Tranche #3 — Mainnet Launch (40% = $60,000)
**Timeline: Weeks 17-24**

**Objective:** Production deployment on Stellar mainnet with at least 1 live corridor processing real transfers.

| # | Deliverable | Verification Method |
|---|---|---|
| 3.1 | $RMTAI token issued on Stellar mainnet with AUTH_REQUIRED, AUTH_REVOCABLE, AUTH_CLAWBACK_ENABLED | Asset visible on stellar.expert/public |
| 3.2 | All 4 Soroban contracts deployed to Stellar mainnet | Contract addresses on mainnet; verified source code |
| 3.3 | stellar.toml published at remittai.com/.well-known/stellar.toml | Accessible via HTTPS; validates on Stellar Laboratory |
| 3.4 | DEX liquidity live: RMTAI/USDC and RMTAI/XLM pairs with minimum $10,000 liquidity each | Orderbook visible on stellar.expert |
| 3.5 | At least 1 live corridor operational with a real anchor partner (target: US>Philippines or US>Mexico) | Verifiable by completing a real small-value transfer |
| 3.6 | AI routing engine processing live mainnet transactions | On-chain evidence of path payments executed via AI-selected routes |
| 3.7 | Complete developer documentation: API reference, contract interfaces, integration guide | Published documentation site (docs.remittai.com or GitHub) |
| 3.8 | SDK/library for third-party developers to integrate RemittAI transfers into their apps | npm package published with usage examples |
| 3.9 | Public real-time dashboard showing mainnet metrics: volume, fees, burns, staking TVL, corridor activity | Live dashboard with mainnet data |
| 3.10 | Security: Soroban Audit Bank audit completed (applied separately) OR independent audit report published | Published audit report |

**Success Criteria:**
- $RMTAI token live on mainnet with correct authorization flags
- At least 1 corridor processing real transfers with a licensed anchor partner
- AI router demonstrably selects better routes than default path (measured by recipient value delivered)
- Developer documentation sufficient for a third-party to integrate within 1 day
- All smart contract source code open-sourced and verified

---

## ECOSYSTEM IMPACT

### How RemittAI Benefits the Stellar Ecosystem

1. **Drives real transaction volume:** Each remittance generates multiple Stellar operations (path payments, DEX trades, token transfers). At target volume of $10M/month, this represents thousands of daily transactions on Stellar.

2. **Increases USDC usage on Stellar:** USDC is the primary settlement asset. More remittance volume = more USDC demand on Stellar = deeper liquidity for the entire ecosystem.

3. **Onboards non-crypto users:** RemittAI's mainstream UX brings people onto Stellar who would never use a blockchain directly. Each remittance user gets a Stellar account, expanding the network's user base.

4. **Strengthens the anchor network:** By onboarding and incentivizing anchors in underserved corridors (Africa, Southeast Asia, Latin America), RemittAI fills gaps in Stellar's anchor infrastructure that benefit all Stellar-based applications.

5. **Demonstrates Soroban's capabilities:** Four production Soroban contracts (staking, fees, governance, escrow) provide real-world examples and open-source reference implementations for other developers.

6. **Open-source AI tools:** The AI routing engine, FX optimizer, and fraud scorer will be open-sourced, providing reusable components for any Stellar-based payment application.

7. **Validates Stellar's core thesis:** Stellar was designed for cross-border payments. RemittAI is the most complete realization of that vision — combining path payments, anchors, SEP standards, and Soroban into a single, production-ready remittance protocol.

---

## COMPETITIVE LANDSCAPE

| Competitor | Differentiation |
|---|---|
| Remittix ($RTX) | Built on Ethereum (expensive gas), no AI, requires users to hold crypto, no mobile money |
| MoneyGram Access | Cash-in/cash-out only — no AI optimization, no token incentives for liquidity |
| Wise/Remitly | Uses banking rails (slow), no blockchain, no token model |
| Ripple/XRP | Targets banks, not consumers; SEC regulatory history |
| USDT/USDC direct | Requires crypto literacy, no integrated fiat off-ramps, no fraud protection |

RemittAI is the only project that combines Stellar's path payments, Soroban smart contracts, AI optimization, and mobile money access in a single protocol.

---

## LONG-TERM SUSTAINABILITY

RemittAI is designed to be self-sustaining through protocol fees:
- 0.50-0.75% fee on each transfer
- At $10M/month volume (Month 12 target): $65,000/month revenue
- Fee distribution: 20% burn, 40% staking rewards, 30% operations, 10% AI development
- DAO governance transition planned for Month 16-18

The project does not depend on ongoing grants after the initial build phase.

---

## OPEN-SOURCE COMMITMENT

All Soroban smart contracts will be open-sourced under MIT license:
- `rmtai-staking` — Tiered staking with reward distribution
- `rmtai-fee-collector` — Fee collection and burn mechanism
- `rmtai-governance` — On-chain voting
- `rmtai-escrow` — Conditional payment holds

The AI routing engine and fraud scoring library will also be open-sourced, providing reusable tools for any Stellar-based payment project.

**GitHub:** [github.com/RemittAI-com/remittai-protocol](https://github.com/RemittAI-com/remittai-protocol)

---

## LINKS

- Website: [remittai.com](https://remittai.com)
- Litepaper: [github.com/RemittAI-com/remittai-protocol/blob/main/proposal/litepaper.md](https://github.com/RemittAI-com/remittai-protocol/blob/main/proposal/litepaper.md)
- GitHub: [github.com/RemittAI-com/remittai-protocol](https://github.com/RemittAI-com/remittai-protocol)
- Testnet Token: [stellar.expert/explorer/testnet/asset/RMTAI-GBEBPSRQCVC5ZVVHJSHKR37G2EL4F2Y6GIHAY4JD2WVG3KSKUNZSRNGB](https://stellar.expert/explorer/testnet/asset/RMTAI-GBEBPSRQCVC5ZVVHJSHKR37G2EL4F2Y6GIHAY4JD2WVG3KSKUNZSRNGB)
- Twitter/X: [@REMITTai_](https://x.com/REMITTai_)

---

## ADDITIONAL APPLICATIONS

We intend to separately apply for:
1. **Soroban Audit Bank** — Security audit coverage for our 4 Soroban contracts
2. **Stellar Matching Fund** — To match external investment (Pre-seed/Seed stage)

These applications will be submitted independently and do not overlap with this Build Award request.
