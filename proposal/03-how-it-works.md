# 03 — How RemittAI Works

## System Architecture

```
SENDER (Country A)                          RECIPIENT (Country B)
     |                                              ^
     v                                              |
[Mobile App / Web UI]                    [Mobile Money / Cash Agent / Bank]
     |                                              ^
     v                                              |
[Sending Anchor]                          [Receiving Anchor]
  - Accepts fiat (bank, mobile money,       - Converts stablecoin to local fiat
    card, cash agent)                       - Pays out via mobile money, bank,
  - KYC via SEP-12                            or cash pickup
  - Issues tokenized fiat on Stellar        - KYC via SEP-12
     |                                              ^
     v                                              |
[=== STELLAR NETWORK + AI LAYER ===]
     |                                              |
     v                                              |
[AI Routing Engine]  -->  [Path Payment]  -->  [Settlement]
  - Finds optimal path         - Atomic multi-hop        - 5-7 seconds
  - Times FX execution           conversion               - Absolute finality
  - Selects liquidity pools    - e.g., PHP > XLM >       - Sub-cent fee
  - Fraud scoring                USDC > MXN
```

## The Transfer Flow (User Perspective)

### Step 1: Sender Initiates Transfer
- Opens RemittAI app or web interface
- Enters recipient details (phone number or wallet)
- Specifies amount to send in their local currency
- Sees **guaranteed receive amount** in recipient's currency (locked FX rate for 60 seconds)
- Sees **total fee** (transparent, no hidden FX markup)

### Step 2: Sender Funds the Transfer
- Pays via bank transfer, debit card, mobile money, or cash at an agent
- Funds received by the **Sending Anchor** (licensed money transmitter in sender's country)
- Anchor performs KYC check (SEP-12) and issues tokenized fiat on Stellar

### Step 3: AI Engine Optimizes the Route
This is where RemittAI's intelligence layer kicks in:

**Route Optimization:**
- Scans all available paths on Stellar's DEX (order books + AMM pools)
- Evaluates direct pairs vs. multi-hop routes (e.g., NGN > XLM > USDC > KES)
- Factors in slippage, liquidity depth, and pool fees
- Selects the path that delivers the most value to the recipient

**FX Timing:**
- AI model trained on historical FX volatility patterns
- For non-urgent transfers, can suggest optimal execution windows
- For large transfers, can split execution across time windows to reduce market impact

**Fraud Detection:**
- Behavioral analysis of sender/recipient patterns
- Velocity checks (unusual frequency, amount, corridor)
- Network graph analysis (connected wallets, known bad actors)
- Real-time risk scoring — high-risk transfers flagged for manual review

### Step 4: Atomic Settlement on Stellar
- Path payment executes in a single transaction
- All hops settle atomically — no partial fills, no counterparty risk
- Transaction confirmed in 5-7 seconds with absolute finality
- $RMAI fee is deducted (or equivalent value if user pays in fiat)

### Step 5: Recipient Gets Paid
- **Receiving Anchor** in recipient's country receives the settlement
- Converts to local fiat
- Delivers via:
  - **Mobile money** (M-Pesa, GCash, Wave, etc.) — instant
  - **Bank deposit** — same day
  - **Cash pickup** at agent location — within hours
- Recipient receives SMS/push notification with confirmation

**Total time: Under 60 seconds end-to-end (mobile money payout)**
**Total cost: <1% all-in**

---

## The AI Layer — Deep Dive

### AI Component 1: Smart Routing Engine

```
Input:  Send $500 USD from New York to Manila (PHP)
        Available paths on Stellar DEX:

        Path A: USD > XLM > PHP          (2 hops, thin PHP liquidity)
        Path B: USD > USDC > XLM > PHP   (3 hops, better rates)
        Path C: USD > USDC > PHP         (2 hops, direct USDC/PHP pool)

AI evaluates:
        Path A: Recipient gets 27,850 PHP (slippage: 0.8%)
        Path B: Recipient gets 27,920 PHP (slippage: 0.3%)
        Path C: Recipient gets 27,960 PHP (slippage: 0.1%)

Output: Execute Path C — best value for recipient
```

- Runs in <100ms before each transaction
- Considers liquidity depth at each hop
- Adapts in real-time as market conditions change
- Falls back to USDC settlement rail if exotic pair liquidity is insufficient

### AI Component 2: FX Optimization Agent

- Monitors FX rate movements across corridors
- For recurring remittances (e.g., monthly family support), learns optimal send windows
- Provides "FX alerts" — notifies users when rates are favorable
- For large transfers ($5K+), can execute dollar-cost-averaging over hours/days
- Trained on: central bank rate data, DEX price feeds, historical corridor volatility

### AI Component 3: Fraud & Compliance Engine

| Signal | Detection Method |
|---|---|
| Unusual amount | Statistical deviation from user's history |
| Velocity spike | Frequency analysis (too many transfers too fast) |
| New corridor | First-time country pair for this user |
| Structuring | Amounts just below reporting thresholds |
| Network risk | Graph analysis of connected wallets |
| Sanctions screening | Real-time OFAC/EU/UN sanctions list matching |

- Every transfer gets a risk score (0-100)
- Low risk (0-30): auto-approved, settles instantly
- Medium risk (30-70): additional verification requested
- High risk (70-100): held for manual compliance review
- Continuously improves via feedback loop (confirmed fraud vs. false positives)

### AI Component 4: Liquidity Prediction

- Predicts corridor demand patterns (payday spikes, holiday surges, seasonal migration)
- Alerts liquidity providers to pre-position capital in corridors before demand hits
- Optimizes $RMAI staking incentives to attract liquidity where it's needed most
- Reduces slippage by ensuring pools are funded ahead of high-volume periods

---

## Technical Implementation on Stellar

### Classic Stellar Operations Used

| Operation | Purpose |
|---|---|
| `createAccount` | Onboard new users |
| `changeTrust` | User opts into $RMAI and corridor tokens |
| `pathPaymentStrictReceive` | Atomic FX settlement (guarantee receive amount) |
| `manageSellOffer` | Market makers provide liquidity |
| `setOptions` | Compliance flags on $RMAI (AUTH_REQUIRED, AUTH_REVOCABLE, CLAWBACK) |

### Soroban Smart Contracts

| Contract | Purpose |
|---|---|
| `rmai_fee_collector` | Collects protocol fees, triggers buyback-and-burn |
| `rmai_staking` | Liquidity provider staking and reward distribution |
| `rmai_governance` | On-chain voting for corridor expansion, fee changes |
| `rmai_escrow` | Conditional transfers (hold-and-release for compliance) |
| `rmai_oracle` | AI agent FX feeds and risk scores published on-chain |

### SEP Standards Implemented

| SEP | Purpose |
|---|---|
| SEP-1 | Stellar.toml for asset discovery and anchor info |
| SEP-10 | Authentication (user <> anchor mutual auth) |
| SEP-12 | KYC data submission and verification |
| SEP-24 | Interactive deposit/withdrawal flows |
| SEP-31 | Cross-border payment API (anchor-to-anchor) |
| SEP-8 | Regulated asset approval (every transfer approved by compliance engine) |
