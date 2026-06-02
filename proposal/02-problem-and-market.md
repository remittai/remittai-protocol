# 02 — Problem Statement & Market Opportunity

## The Remittance Market

### Market Size
- **$800B+** sent globally per year in remittances (World Bank 2025)
- **$150B+** sent from the US alone (largest sending country)
- Remittances are the **largest source of foreign income** for 25+ developing countries — larger than foreign aid and FDI combined
- Market growing 3-5% annually, driven by migration trends and diaspora growth

### Top Corridors by Volume

| Corridor | Annual Volume | Avg Fee | Avg Speed |
|---|---|---|---|
| US to Mexico | $63B+ | 4-6% | 1-3 days |
| US to India | $30B+ | 3-5% | 1-3 days |
| US to Philippines | $38B+ | 5-7% | 1-3 days |
| Gulf States to India/Pakistan | $50B+ | 4-6% | 1-5 days |
| UK to Nigeria | $25B+ | 6-10% | 1-3 days |
| South Africa to Zimbabwe | $2B+ | 10-15% | 1-5 days |
| Intra-Africa | $20B+ | 8-15%+ | 3-7 days |
| US to Central America | $35B+ | 5-8% | 1-3 days |

### The Fee Problem in Detail

**What users think they pay:**
- Western Union: "Send for $4.99!" (advertised fee)

**What users actually pay:**
- $4.99 stated fee
- 2-4% FX markup hidden in the exchange rate
- Receiving fees on the other end
- **Real total cost: 7-12% on a $200 transfer**

**Impact:** On $800B in global remittances, ~$48B/year is extracted in fees. That's $48 billion taken from the world's poorest communities.

**UN Sustainable Development Goal 10.c:** Reduce remittance costs to below 3% by 2030. The world is nowhere close — global average is still 6.2%.

### The Speed Problem

| Method | Speed | Cost |
|---|---|---|
| Bank wire (SWIFT) | 3-5 business days | $25-50 flat fee |
| Western Union (cash pickup) | Minutes-hours (if available) | 5-10%+ all-in |
| Wise (TransferWise) | 1-2 business days | 0.5-2% |
| PayPal/Venmo (international) | 1-3 business days | 3-5% |
| Crypto (current, manual) | Minutes | Variable, UX barrier |
| **RemittAI (target)** | **5-7 seconds** | **<1%** |

### The Unbanked Problem

- **1.4 billion adults** globally have no bank account
- In Sub-Saharan Africa, only 55% of adults have any financial account
- These populations rely on **cash** and **mobile money** (M-Pesa, GCash, etc.)
- Traditional remittance requires bank accounts or physical agent locations
- Mobile money is the on-ramp — there are **1.75 billion registered mobile money accounts** worldwide

### Why Existing Solutions Fall Short

**Traditional Providers (Western Union, MoneyGram):**
- High fees fund massive physical infrastructure (500K+ agent locations)
- Slow settlement because they batch transactions and manage FX risk internally
- Profitable precisely because corridors are opaque and competitive pressure is low

**Fintech (Wise, Remitly, WorldRemit):**
- Better fees (1-3%) but still use traditional banking rails underneath
- Speed limited by SWIFT/ACH settlement (1-3 days typical)
- Still require bank accounts on at least one end
- Not available in many high-fee corridors

**Previous Crypto Attempts:**
- **Ripple/XRP:** Focused on institutional bank-to-bank settlement. Not consumer-facing. Regulatory challenges (SEC lawsuit) damaged trust.
- **Celo:** Mobile-first approach but struggled with anchor network and adoption
- **Bitcoin/Lightning:** Fast but volatile. Not practical for remittance (recipient needs stable value)
- **Stablecoins (USDC/USDT):** Work technically but require crypto literacy. No AI optimization. No integrated fiat off-ramps in most corridors.

**What's missing:** An integrated solution that combines stablecoin speed with AI-optimized routing, fiat on/off ramps for the unbanked, and a token model that incentivizes liquidity in underserved corridors.

---

## The RemittAI Opportunity

### Addressable Market

| Segment | Size | RemittAI Target |
|---|---|---|
| Total global remittances | $800B | — |
| Digital remittances | $250B+ | Primary market |
| Underserved corridors (Africa, SEA, Pacific) | $100B+ | Highest-margin opportunity |
| Mobile money-linked remittances | $50B+ | Key on-ramp |
| **Year 1 realistic target** | **$120M volume** | **$1.2M fee revenue at <1%** |

### Competitive Positioning

RemittAI sits at the intersection of three trends:

```
Traditional Remittance ——— Too expensive, too slow
         |
    RemittAI fills the gap
         |
Crypto Rails ——————————— Too complex for mainstream users
         |
    AI Optimization adds intelligence
         |
AI Agents ————————————— No payment infrastructure
```

**RemittAI's unique position:** The only protocol that combines:
1. Stellar's payment-optimized blockchain (path payments, anchors, compliance)
2. AI-driven optimization (routing, FX timing, fraud detection)
3. Token-incentivized liquidity for underserved corridors
4. Mobile money integration for unbanked populations
