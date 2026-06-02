// RemittAI Fee Collector Contract
//
// Collects protocol fees from remittance transfers and manages the
// buyback-and-burn mechanism.
//
// Fee structure:
//   - 0.75% for fiat/USDC payers
//   - 0.50% for $RMTAI payers (33% discount)
//
// Fee distribution:
//   - 20% -> buyback and burn (RMTAI purchased from DEX and sent to burn address)
//   - 40% -> staking reward pool
//   - 30% -> treasury (operations)
//   - 10% -> AI development fund

#![no_std]

use soroban_sdk::{contract, contracterror, contractimpl, contracttype, token, Address, Env};

// Fee rates in basis points (0.75% = 75, 0.50% = 50)
const FIAT_FEE_BPS: i128 = 75;
const TOKEN_FEE_BPS: i128 = 50;

// Distribution basis points (out of 10000)
const BURN_SHARE_BPS: u32 = 2000;    // 20%
const STAKING_SHARE_BPS: u32 = 4000; // 40%
const TREASURY_SHARE_BPS: u32 = 3000; // 30%
const AI_FUND_SHARE_BPS: u32 = 1000;  // 10%

#[contracttype]
#[derive(Clone, Debug)]
pub enum DataKey {
    Admin,
    RmtaiToken,
    UsdcToken,
    BurnAddress,
    StakingContract,
    TreasuryAddress,
    AiFundAddress,
    TotalFeesCollected,
    TotalBurned,
    Initialized,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum FeeError {
    NotInitialized = 1,
    AlreadyInitialized = 2,
    NotAdmin = 3,
    ZeroAmount = 4,
    InvalidFeeType = 5,
}

#[contract]
pub struct RmtaiFeeCollector;

#[contractimpl]
impl RmtaiFeeCollector {
    /// Initialize the fee collector.
    ///
    /// # Arguments
    /// - `admin` - Admin address
    /// - `rmtai_token` - RMTAI token contract address
    /// - `usdc_token` - USDC token contract address
    /// - `burn_address` - Address to send burned tokens (locked account)
    /// - `staking_contract` - Staking contract address (receives reward pool share)
    /// - `treasury` - Treasury address (operations)
    /// - `ai_fund` - AI development fund address
    pub fn initialize(
        env: Env,
        admin: Address,
        rmtai_token: Address,
        usdc_token: Address,
        burn_address: Address,
        staking_contract: Address,
        treasury: Address,
        ai_fund: Address,
    ) -> Result<(), FeeError> {
        if env.storage().instance().has(&DataKey::Initialized) {
            return Err(FeeError::AlreadyInitialized);
        }

        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::RmtaiToken, &rmtai_token);
        env.storage().instance().set(&DataKey::UsdcToken, &usdc_token);
        env.storage().instance().set(&DataKey::BurnAddress, &burn_address);
        env.storage().instance().set(&DataKey::StakingContract, &staking_contract);
        env.storage().instance().set(&DataKey::TreasuryAddress, &treasury);
        env.storage().instance().set(&DataKey::AiFundAddress, &ai_fund);
        env.storage().instance().set(&DataKey::TotalFeesCollected, &0_i128);
        env.storage().instance().set(&DataKey::TotalBurned, &0_i128);
        env.storage().instance().set(&DataKey::Initialized, &true);

        Ok(())
    }

    /// Collect a fee from a remittance transfer.
    /// Called by the protocol after each successful transfer.
    ///
    /// # Arguments
    /// - `payer` - Address paying the fee
    /// - `transfer_amount` - Total transfer amount (in USDC stroops)
    /// - `pay_in_rmtai` - True if payer wants to pay fee in RMTAI (discounted)
    pub fn collect_fee(
        env: Env,
        payer: Address,
        transfer_amount: i128,
        pay_in_rmtai: bool,
    ) -> Result<i128, FeeError> {
        Self::require_initialized(&env)?;
        payer.require_auth();

        if transfer_amount <= 0 {
            return Err(FeeError::ZeroAmount);
        }

        let fee_bps = if pay_in_rmtai { TOKEN_FEE_BPS } else { FIAT_FEE_BPS };
        let fee_amount = transfer_amount * fee_bps / 10000;

        if fee_amount <= 0 {
            return Ok(0);
        }

        // Determine which token to collect fee in
        let token_key = if pay_in_rmtai {
            DataKey::RmtaiToken
        } else {
            DataKey::UsdcToken
        };
        let token_address: Address = env.storage().instance().get(&token_key).unwrap();
        let token_client = token::Client::new(&env, &token_address);

        // Transfer fee from payer to this contract
        token_client.transfer(&payer, &env.current_contract_address(), &fee_amount);

        // Update total fees collected
        let total: i128 = env.storage().instance().get(&DataKey::TotalFeesCollected).unwrap();
        env.storage().instance().set(&DataKey::TotalFeesCollected, &(total + fee_amount));

        Ok(fee_amount)
    }

    /// Distribute accumulated fees to burn, staking, treasury, and AI fund.
    /// Can be called by anyone (permissionless — encourages regular distribution).
    ///
    /// # Arguments
    /// - `token_address` - Which token to distribute (RMTAI or USDC)
    pub fn distribute_fees(
        env: Env,
        token_address: Address,
    ) -> Result<(), FeeError> {
        Self::require_initialized(&env)?;

        let token_client = token::Client::new(&env, &token_address);
        let balance = token_client.balance(&env.current_contract_address());

        if balance <= 0 {
            return Ok(());
        }

        let burn_amount = balance * BURN_SHARE_BPS as i128 / 10000;
        let staking_amount = balance * STAKING_SHARE_BPS as i128 / 10000;
        let treasury_amount = balance * TREASURY_SHARE_BPS as i128 / 10000;
        let ai_amount = balance - burn_amount - staking_amount - treasury_amount; // remainder to avoid rounding loss

        let burn_addr: Address = env.storage().instance().get(&DataKey::BurnAddress).unwrap();
        let staking_addr: Address = env.storage().instance().get(&DataKey::StakingContract).unwrap();
        let treasury_addr: Address = env.storage().instance().get(&DataKey::TreasuryAddress).unwrap();
        let ai_addr: Address = env.storage().instance().get(&DataKey::AiFundAddress).unwrap();

        if burn_amount > 0 {
            token_client.transfer(&env.current_contract_address(), &burn_addr, &burn_amount);
            let total_burned: i128 = env.storage().instance().get(&DataKey::TotalBurned).unwrap();
            env.storage().instance().set(&DataKey::TotalBurned, &(total_burned + burn_amount));
        }
        if staking_amount > 0 {
            token_client.transfer(&env.current_contract_address(), &staking_addr, &staking_amount);
        }
        if treasury_amount > 0 {
            token_client.transfer(&env.current_contract_address(), &treasury_addr, &treasury_amount);
        }
        if ai_amount > 0 {
            token_client.transfer(&env.current_contract_address(), &ai_addr, &ai_amount);
        }

        Ok(())
    }

    // --- View functions ---

    /// Get total fees collected since contract deployment.
    pub fn get_total_fees(env: Env) -> Result<i128, FeeError> {
        Self::require_initialized(&env)?;
        Ok(env.storage().instance().get(&DataKey::TotalFeesCollected).unwrap())
    }

    /// Get total RMTAI burned via fee distribution.
    pub fn get_total_burned(env: Env) -> Result<i128, FeeError> {
        Self::require_initialized(&env)?;
        Ok(env.storage().instance().get(&DataKey::TotalBurned).unwrap())
    }

    /// Calculate the fee for a given transfer amount.
    pub fn calculate_fee(_env: Env, transfer_amount: i128, pay_in_rmtai: bool) -> i128 {
        let fee_bps = if pay_in_rmtai { TOKEN_FEE_BPS } else { FIAT_FEE_BPS };
        transfer_amount * fee_bps / 10000
    }

    // --- Internal ---

    fn require_initialized(env: &Env) -> Result<(), FeeError> {
        if !env.storage().instance().has(&DataKey::Initialized) {
            return Err(FeeError::NotInitialized);
        }
        Ok(())
    }
}
