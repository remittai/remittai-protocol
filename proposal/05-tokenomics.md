# 05 — Tokenomics: $RMTAI Token

## Token Overview

| Parameter | Detail |
|---|---|
| **Token Name** | RemittAI |
| **Ticker** | $RMTAI |
| **Network** | Stellar (native asset) + Soroban contract layer |
| **Asset Code** | RMTAI (Alphanumeric12 on Stellar) |
| **Total Supply** | 1,000,000,000 (1 billion) — fixed, non-inflationary |
| **Decimals** | 7 (Stellar standard) |
| **Supply Lock** | Issuing account weights set to 0 after minting (no additional minting possible) |

## Why Fixed Supply

- Eliminates inflation risk — holders know supply will never increase
- Creates natural scarcity as adoption grows
- Burn mechanism reduces circulating supply over time
- Simpler regulatory positioning — no "money printing" function
- Precedent: Bitcoin (21M cap), Remittix (1.5B cap)

---

## Token Distribution

| Allocation | % | Tokens | Vesting | Purpose |
|---|---|---|---|---|
| **Public Sale** | 30% | 300,000,000 | Immediate (no lock) | Community distribution, initial liquidity |
| **Liquidity Provision** | 20% | 200,000,000 | 10% at TGE, then linear over 24 months | DEX liquidity pools, anchor corridor liquidity |
| **Team & Founders** | 15% | 150,000,000 | 12-month cliff, then linear over 36 months | Aligned incentives; team can't dump early |
| **Ecosystem & Grants** | 15% | 150,000,000 | Released per governance vote over 48 months | Anchor onboarding, developer grants, integrations |
| **AI Development Fund** | 10% | 100,000,000 | Linear over 36 months | AI model training, oracle infrastructure, R&D |
| **Treasury / Reserve** | 5% | 50,000,000 | Governance-controlled, 6-month cliff | Emergency fund, strategic partnerships, listings |
| **Advisors** | 5% | 50,000,000 | 6-month cliff, then linear over 24 months | Industry advisors, regulatory counsel |

### Distribution Rationale

**50% to community/liquidity (Public Sale + Liquidity):**
- Ensures broad distribution and decentralization
- Prevents "insider token" narrative that killed many projects
- Provides deep liquidity from day one

**15% team with 12-month cliff + 36-month vest:**
- Team gets nothing for the first year — pure alignment signal
- 4-year total lockup demonstrates long-term commitment
- Industry standard (Remittix does not publicly disclose team vesting — a red flag)

**15% ecosystem/grants:**
- Funds anchor partnerships in target corridors
- Developer grants for building on the protocol
- Governed by token holders, not the team

**10% AI development:**
- Dedicated fund ensures the AI layer is properly resourced
- Covers model training, compute costs, oracle infrastructure
- Separate from team allocation to maintain transparency

### Vesting Schedule Visual

```
Month:  0    3    6    9    12   18   24   30   36   42   48
        |    |    |    |    |    |    |    |    |    |    |
Public  [====ALL UNLOCKED====]
Liquid  [10%][----linear monthly release until month 24----]
Team    [----cliff, nothing----|====linear monthly until 48====]
Eco     [------governance-voted releases over 48 months-------]
AI Dev  [--------linear monthly release until month 36--------]
Reserve [----cliff----|====governance-controlled release=======]
Advisor [--cliff--|====linear monthly until month 30==========]
```

---

## Token Utility (Why $RMTAI Has Value)

### 1. Protocol Fee Payment (Primary Utility)

Every remittance through the protocol incurs a fee. Users can pay in two ways:

| Payment Method | Fee Rate | Mechanism |
|---|---|---|
| Pay fee in fiat/USDC | 0.75% of transfer | Standard rate |
| Pay fee in $RMTAI | 0.50% of transfer | 33% discount for using token |

**Why this works:** Creates consistent buy pressure. Users who send frequently are incentivized to hold $RMTAI for savings. Even users who don't want to hold crypto benefit — the protocol buys $RMTAI on their behalf for the discounted rate.

### 2. Liquidity Provider Staking

Market makers and liquidity providers stake $RMTAI to:
- Provide corridor liquidity (e.g., USDC/MXN, USDC/PHP pools)
- Earn a share of protocol fees from their corridor
- Earn bonus $RMTAI rewards (from the Liquidity Provision allocation)

**Staking tiers:**

| Tier | Stake Required | Fee Share | Bonus APY | Corridors |
|---|---|---|---|---|
| Bronze | 10,000 $RMTAI | 40% of corridor fees | 5% | 1 corridor |
| Silver | 50,000 $RMTAI | 50% of corridor fees | 8% | 3 corridors |
| Gold | 250,000 $RMTAI | 60% of corridor fees | 12% | All corridors |

**Why this works:** Directs liquidity to where it's needed. Underserved corridors (Africa, Pacific Islands) can offer higher staking rewards to attract capital — solving the chicken-and-egg liquidity problem.

### 3. AI Oracle Rewards

AI agents that contribute to the protocol earn $RMTAI:

| AI Service | Reward Source | Mechanism |
|---|---|---|
| FX rate feeds | Oracle reward pool | Per-feed payment |
| Route optimization | Share of fee savings | Better route = more reward |
| Fraud scoring | Per-transaction fee | Risk assessment service |
| Liquidity prediction | Staking efficiency bonus | Correct predictions rewarded |

**Why this works:** Creates an open market for AI services. Third-party developers can build and deploy AI agents that earn $RMTAI — growing the protocol's intelligence without centralized development.

### 4. Governance

$RMTAI holders vote on:
- New corridor expansion priorities
- Fee structure changes
- Ecosystem grant allocations
- Protocol upgrades
- Treasury spending
- AI model selection and parameters

**Voting power:** 1 token = 1 vote. Staked tokens get 1.5x voting weight (rewards active participants).

### 5. Burn Mechanism

| Source | Burn Rate | Mechanism |
|---|---|---|
| Protocol fees (fiat-paid) | 20% of fee revenue | Protocol buys $RMTAI on DEX and burns |
| Excess oracle rewards | Unallocated rewards burned quarterly | Prevents reward inflation |
| Compliance penalties | 100% of clawback proceeds | Burned, not redistributed |

**Burn math example:**
- Monthly transfer volume: $10M
- Average fee: 0.65% (blended fiat + token payers)
- Monthly fee revenue: $65,000
- 20% burn allocation: $13,000/month in $RMTAI bought and burned
- Annual burn: ~$156,000 in $RMTAI removed from circulation
- As volume scales to $100M/month: ~$1.56M/year burned

**Burn address:** Tokens sent to a Stellar account with all signing weights set to 0 (provably unspendable).

---

## Token Value Accrual Model

```
Remittance Volume Growth
         |
         v
More Protocol Fees Collected
         |
    +---------+---------+
    |         |         |
    v         v         v
Fee Discount  Staking   Buyback
(buy RMTAI)   Rewards   & Burn
    |         |         |
    v         v         v
Buy Pressure  Hold      Supply
Increases     Incentive  Decreases
    |         |         |
    +----+----+---------+
         |
         v
   Token Value Appreciation
         |
         v
   More LPs Stake (better liquidity)
         |
         v
   Better Rates for Users
         |
         v
   More Volume (flywheel repeats)
```

---

## Revenue Model

### Protocol Revenue Streams

| Stream | Source | Year 1 Est. | Year 3 Est. |
|---|---|---|---|
| Remittance fees | 0.50-0.75% per transfer | $600K-$900K | $6M-$9M |
| Anchor licensing | Annual fee for anchor partners | $50K-$100K | $200K-$500K |
| AI oracle services | Premium FX/routing data feeds | $0 (free tier first) | $500K-$1M |
| Enterprise API | B2B remittance-as-a-service | $0 (year 2 launch) | $1M-$3M |

### Year 1 Revenue Projections (Conservative)

| Month | Transfer Volume | Fee Revenue | Cumulative |
|---|---|---|---|
| 1-3 | $500K/mo | $3,250/mo | $9,750 |
| 4-6 | $2M/mo | $13,000/mo | $48,750 |
| 7-9 | $5M/mo | $32,500/mo | $146,250 |
| 10-12 | $10M/mo | $65,000/mo | $341,250 |
| **Year 1 Total** | — | — | **~$341K** |

### Year 3 Target

| Metric | Target |
|---|---|
| Monthly volume | $100M |
| Monthly fee revenue | $650K |
| Annual fee revenue | $7.8M |
| Monthly burn | $130K |
| Active corridors | 15-20 |
| Anchor partners | 25+ |

---

## Comparison: RemittAI vs Remittix Tokenomics

| Dimension | RemittAI ($RMTAI) | Remittix ($RTX) |
|---|---|---|
| Total supply | 1B | 1.5B |
| Public allocation | 30% | Not fully disclosed |
| Team vesting | 12-month cliff + 36-month linear | Not publicly disclosed |
| Staking minimum | 10,000 tokens (Bronze) | $10,000 USD (VIP only) |
| Staking APY | 5-12% (tiered, all holders) | 10-18% (VIP only) |
| Burn mechanism | 20% of protocol fees | Not mentioned |
| AI utility | Core (routing, FX, fraud, oracles) | None |
| Governance | All holders vote | VIP holders only |
| Fee discount | 33% off when paying in token | Not mentioned |
| Transparency | Full vesting schedules published | Limited disclosure |

**Key advantage:** Our tokenomics are more accessible (lower staking minimums), more transparent (published vesting), and have clearer value accrual (burn + fee discount + AI rewards). Remittix gates key features behind a $10K VIP wall — we're built for the masses.

---

## Anti-Dump Protections

1. **Team cliff (12 months):** No team tokens enter circulation for a full year
2. **Advisor cliff (6 months):** Advisors locked for 6 months minimum
3. **Liquidity lockup:** 90% of liquidity allocation locked for 24 months
4. **No single wallet >5%:** Public sale structured to prevent whale concentration
5. **Burn reduces supply:** Counter-pressure against selling
6. **Staking incentives:** Rewards for holding, opportunity cost for selling
7. **SEP-8 regulated asset:** Every transfer approved — can enforce transfer limits if needed during early trading

---

## Securities Law Considerations

**Designed to pass the Howey Test as a utility token:**

1. **Investment of money** — Yes (public sale), but primary use is protocol access
2. **Common enterprise** — Mitigated by decentralized governance and open-source protocol
3. **Expectation of profits** — Mitigated by emphasizing utility (fee discounts, staking for corridor access, governance) over investment returns
4. **From the efforts of others** — Mitigated by decentralized AI oracle network, community governance, open anchor ecosystem

**Recommended legal steps:**
- Engage crypto-specialized legal counsel (Anderson Kill, Debevoise, or equivalent)
- Consider Reg D exemption for US investors or exclude US from initial sale
- Obtain legal opinion letter on utility token classification
- Structure public sale as access rights, not investment opportunity
- File FinCEN MSB registration before any US operations
