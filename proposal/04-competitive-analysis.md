# 04 — Competitive Analysis

## Landscape Overview

RemittAI competes across three categories: traditional remittance providers, fintech disruptors, and crypto-native remittance projects.

## Traditional Providers

| Provider | Fees (all-in) | Speed | Reach | Weakness |
|---|---|---|---|---|
| Western Union | 5-10% | Hours-days | 500K+ locations, 200 countries | Hidden FX markups, expensive |
| MoneyGram | 5-7% | Hours-days | 350K+ locations | Taken private 2024, uncertain strategy |
| Banks (SWIFT) | 8-25% | 3-5 days | Global but limited corridors | Slowest, most expensive, requires bank accounts |
| PayPal/Xoom | 3-5% | 1-3 days | 130+ countries | Still uses bank rails, limited in Africa |

**Our advantage:** 10-50x cheaper, 100-1000x faster, no bank account required.

## Fintech Disruptors

| Provider | Fees | Speed | Model | Weakness |
|---|---|---|---|---|
| Wise | 0.5-2% | 1-2 days | Mid-market rate + transparent fee | Still uses bank settlement rails; slow |
| Remitly | 2-4% | Hours-days | Digital-first, mobile money payouts | No token model, no AI optimization |
| WorldRemit | 2-5% | Hours-days | 150+ countries, mobile money | Higher fees in key corridors |
| Chipper Cash | 1-3% | Instant (intra-Africa) | P2P Africa-focused | Africa-only, no token, equity-funded |

**Our advantage:** Faster settlement (seconds vs hours/days), token-incentivized liquidity for underserved corridors, AI-optimized routing.

## Crypto-Native Competitors

### Remittix ($RTX) — Most Direct Competitor

| Dimension | Remittix ($RTX) | RemittAI |
|---|---|---|
| **Chain** | Ethereum (ERC-20) | Stellar |
| **Tx fees** | Ethereum gas ($1-20+) | Stellar (~$0.00001) |
| **Settlement** | Depends on Ethereum finality | 5-7 seconds, absolute |
| **Core model** | Crypto-to-fiat conversion | AI-optimized fiat-to-fiat via crypto rails |
| **AI integration** | None mentioned | Core differentiator (routing, FX, fraud) |
| **Target user** | Crypto holders sending to fiat | Anyone — crypto is invisible middleware |
| **Presale** | Raised $28M+ | TBD |
| **Currencies** | 30+ | Corridor-by-corridor expansion |
| **Staking** | 10-18% APY (VIP only, $10K min) | Liquidity provider staking (accessible) |
| **Compliance** | CertiK audit | Stellar native compliance (SEP-8, clawback) |
| **Mobile money** | Not emphasized | Core focus (M-Pesa, GCash, Wave) |
| **Unbanked access** | Requires bank account on receive end | Cash agent + mobile money payouts |

**Key differentiators vs Remittix:**
1. **Stellar vs Ethereum** — Sub-cent fees vs dollar+ gas costs. This alone changes the economics for small remittances ($50-200).
2. **AI layer** — Remittix has no AI. Our routing, FX timing, and fraud detection are genuine product advantages.
3. **Fiat-to-fiat design** — Remittix requires the sender to already hold crypto. We target mainstream users who send fiat and recipients receive fiat. Crypto is invisible.
4. **Unbanked focus** — Remittix requires bank accounts. We integrate mobile money and cash agents for the 1.4B unbanked.
5. **Built-in compliance** — Stellar's SEP framework gives us regulated asset controls that Ethereum doesn't natively support.

### SurgePay — Stellar-Native Competitor (Africa-Focused)

| Dimension | SurgePay | RemittAI |
|---|---|---|
| **Chain** | Stellar + Base | Stellar |
| **Launched** | February 2026 | In development |
| **Backed by** | Stellar Community Fund + Base | Applying to SCF |
| **Target market** | African diaspora — freelancers, remote workers, family support | Global — all major remittance corridors |
| **Core features** | Virtual cards, payroll, invoicing, stablecoin spend | AI routing, FX optimization, fraud detection, staking |
| **Token model** | No public token | $RMTAI with staking, burns, governance |
| **AI integration** | Not mentioned | Core differentiator |
| **Geographic scope** | Africa-focused corridors ($95B market) | Global corridors ($800B+ market) |
| **Revenue model** | FX fees on card spend, transaction fees | Protocol fees on remittance transfers |
| **Product breadth** | Broader (cards, payroll, invoicing) | Deeper (AI optimization, token incentives) |

**Key differentiators vs SurgePay:**
1. **Global vs Africa-only** — SurgePay targets the $95B African remittance market. We target the full $800B+ global market, starting with US > Philippines and US > Mexico corridors where SurgePay has no presence.
2. **AI moat** — SurgePay has no AI optimization. Our routing engine, FX timing, and fraud detection get smarter with every transaction.
3. **Token economics** — SurgePay has no public token. $RMTAI creates aligned incentives: staking rewards direct liquidity to corridors, burns reduce supply, governance gives the community control.
4. **Corridor strategy** — SurgePay went Africa-first. We target the highest-volume corridors globally (Philippines, Mexico, India) and expand into Africa later with AI as our competitive edge.
5. **Validation signal** — SurgePay received SCF funding, proving SDF actively backs Stellar-based remittance projects. This strengthens our own SCF application.

**Coexistence opportunity:** SurgePay and RemittAI can coexist — they serve different geographies and different user profiles. SurgePay is a broad fintech platform (cards + payroll + invoicing) for African professionals. RemittAI is a deep AI-optimized remittance protocol for global corridors. In the long term, SurgePay could even integrate RemittAI's AI routing engine via our Enterprise API.

### Ripple / XRP

| Dimension | Ripple (XRP) | RemittAI |
|---|---|---|
| **Target** | Bank-to-bank (institutional) | Consumer / SMB |
| **Approach** | Replace SWIFT messaging + ODL | Replace the entire remittance cost structure |
| **Status** | SEC lawsuit damaged trust; ODL adoption limited | Fresh start, no regulatory baggage |
| **User experience** | Banks use RippleNet; end users never see XRP | End users interact with simple app; never see crypto |
| **AI** | None | Core feature |

**Key differentiator:** Ripple targets banks. We target the people those banks overcharge.

### Stablecoins (USDC/USDT Direct)

| Dimension | Raw USDC/USDT | RemittAI |
|---|---|---|
| **Fees** | Network fees only (~$0-1) | <1% protocol fee |
| **UX** | Requires crypto wallet, keys, exchange knowledge | Simple app — enter amount, enter phone number |
| **FX conversion** | User must find and execute swaps manually | AI handles automatically via path payments |
| **Fiat off-ramp** | User must find an exchange or P2P trader | Integrated via anchors (mobile money, cash, bank) |
| **Compliance** | None — P2P, unregulated | Full KYC/AML via SEP-12 |
| **Fraud protection** | None | AI-powered fraud scoring |

**Key differentiator:** USDT on Tron is the "incumbent" crypto remittance tool, but it requires crypto literacy. We wrap that same efficiency in a mainstream UX with compliance and AI.

## Competitive Matrix Summary

```
                    CHEAP ←————————————————→ EXPENSIVE
                      |                         |
           RemittAI   |  Wise                   |  Western Union
           USDT/Tron  |  Remitly                |  Banks/SWIFT
                      |  Remittix               |  PayPal
                      |                         |
    FAST ←———————————————————————————————————————→ SLOW
           RemittAI   |  Western Union (cash)   |  Banks/SWIFT
           USDT/Tron  |  Remitly                |  Wise
           Remittix   |                         |  PayPal
                      |                         |
    ACCESSIBLE ←—————————————————————————————————→ EXCLUSIVE
    (unbanked ok)     |                         |  (bank required)
           RemittAI   |  Western Union (cash)   |  Wise
           M-Pesa     |  WorldRemit             |  Banks
                      |  Remitly                |  Remittix
                      |                         |  PayPal
```

## RemittAI's Defensible Advantages

1. **Stellar's path payments** — No other chain does atomic multi-hop FX conversion natively. This is a protocol-level moat.
2. **AI optimization** — Continuously improving routing, FX timing, and fraud detection creates compounding advantage over time.
3. **Token-incentivized liquidity** — $RMTAI staking rewards direct liquidity to underserved corridors that traditional providers ignore (because they're not profitable enough for their cost structure).
4. **Compliance by design** — AUTH_REQUIRED + SEP-8 regulated asset approval means every transfer is compliant. This opens doors to institutional partnerships that unregulated competitors can't access.
5. **Mobile money integration** — Targeting the 1.75B mobile money accounts that are underserved by both traditional and crypto competitors.
