// RemittAI ($RMTAI) Staking Contract
//
// Liquidity providers stake $RMTAI to:
// - Provide corridor liquidity and earn protocol fees
// - Earn bonus $RMTAI rewards based on their tier
// - Participate in governance with boosted voting weight
//
// Tiers:
//   Bronze: 10,000 RMTAI  -> 5% APY,  40% fee share, 1 corridor
//   Silver: 50,000 RMTAI  -> 8% APY,  50% fee share, 3 corridors
//   Gold:   250,000 RMTAI -> 12% APY, 60% fee share, all corridors

#![no_std]

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, token, Address, Env, Map, Symbol, Vec,
};

// Minimum stake amounts per tier (in RMTAI stroops, 7 decimals)
const BRONZE_MIN: i128 = 100_000_000_000; // 10,000 RMTAI
const SILVER_MIN: i128 = 500_000_000_000; // 50,000 RMTAI
const GOLD_MIN: i128 = 2_500_000_000_000; // 250,000 RMTAI

// APY basis points (5% = 500, 8% = 800, 12% = 1200)
const BRONZE_APY_BPS: u32 = 500;
const SILVER_APY_BPS: u32 = 800;
const GOLD_APY_BPS: u32 = 1200;

// Seconds in a year (for reward calculation)
const SECONDS_PER_YEAR: u64 = 31_536_000;

// Minimum lock period: 7 days
const MIN_LOCK_SECONDS: u64 = 604_800;

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum Tier {
    None,
    Bronze,
    Silver,
    Gold,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct StakeInfo {
    pub amount: i128,
    pub tier: Tier,
    pub staked_at: u64,
    pub last_claimed: u64,
    pub corridor_count: u32,
}

#[contracttype]
#[derive(Clone, Debug)]
pub enum DataKey {
    Admin,
    TokenAddress,
    RewardPool,
    TotalStaked,
    Stake(Address),
    Initialized,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum StakingError {
    NotInitialized = 1,
    AlreadyInitialized = 2,
    NotAdmin = 3,
    InsufficientStake = 4,
    NoStakeFound = 5,
    LockPeriodActive = 6,
    InsufficientRewardPool = 7,
    ZeroAmount = 8,
}

#[contract]
pub struct RmtaiStaking;

#[contractimpl]
impl RmtaiStaking {
    /// Initialize the staking contract.
    /// Called once after deployment.
    ///
    /// # Arguments
    /// - `admin` - Admin address (can add rewards, emergency withdraw)
    /// - `token` - Address of the RMTAI token contract (SAC-wrapped)
    pub fn initialize(
        env: Env,
        admin: Address,
        token: Address,
    ) -> Result<(), StakingError> {
        if env.storage().instance().has(&DataKey::Initialized) {
            return Err(StakingError::AlreadyInitialized);
        }

        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::TokenAddress, &token);
        env.storage().instance().set(&DataKey::TotalStaked, &0_i128);
        env.storage().instance().set(&DataKey::RewardPool, &0_i128);
        env.storage().instance().set(&DataKey::Initialized, &true);

        Ok(())
    }

    /// Stake RMTAI tokens.
    /// Tokens are transferred from the staker to this contract.
    /// Tier is automatically determined by the staked amount.
    ///
    /// # Arguments
    /// - `staker` - Address of the staker (must authorize)
    /// - `amount` - Amount of RMTAI to stake (in stroops)
    pub fn stake(
        env: Env,
        staker: Address,
        amount: i128,
    ) -> Result<StakeInfo, StakingError> {
        Self::require_initialized(&env)?;
        staker.require_auth();

        if amount <= 0 {
            return Err(StakingError::ZeroAmount);
        }

        let token_address: Address = env.storage().instance().get(&DataKey::TokenAddress).unwrap();
        let token_client = token::Client::new(&env, &token_address);

        // Calculate new total for this staker
        let existing_amount = Self::get_staked_amount(&env, &staker);
        let new_total = existing_amount + amount;

        // Determine tier
        let tier = Self::calculate_tier(new_total);
        if tier == Tier::None {
            return Err(StakingError::InsufficientStake);
        }

        // Transfer tokens from staker to contract
        token_client.transfer(&staker, &env.current_contract_address(), &amount);

        // Calculate any pending rewards before updating stake
        let now = env.ledger().timestamp();
        if existing_amount > 0 {
            let pending = Self::calculate_pending_rewards(&env, &staker, now);
            if pending > 0 {
                Self::distribute_reward(&env, &token_client, &staker, pending);
            }
        }

        let corridor_count = match tier {
            Tier::Bronze => 1,
            Tier::Silver => 3,
            Tier::Gold => 100, // effectively unlimited
            Tier::None => 0,
        };

        let stake_info = StakeInfo {
            amount: new_total,
            tier,
            staked_at: now,
            last_claimed: now,
            corridor_count,
        };

        env.storage().persistent().set(&DataKey::Stake(staker.clone()), &stake_info);

        // Update total staked
        let total_staked: i128 = env.storage().instance().get(&DataKey::TotalStaked).unwrap();
        env.storage().instance().set(&DataKey::TotalStaked, &(total_staked + amount));

        Ok(stake_info)
    }

    /// Unstake RMTAI tokens.
    /// Can only unstake after the minimum lock period (7 days).
    /// Automatically claims any pending rewards.
    ///
    /// # Arguments
    /// - `staker` - Address of the staker (must authorize)
    /// - `amount` - Amount to unstake (in stroops). Use 0 to unstake all.
    pub fn unstake(
        env: Env,
        staker: Address,
        amount: i128,
    ) -> Result<i128, StakingError> {
        Self::require_initialized(&env)?;
        staker.require_auth();

        let stake_info: StakeInfo = env
            .storage()
            .persistent()
            .get(&DataKey::Stake(staker.clone()))
            .ok_or(StakingError::NoStakeFound)?;

        let now = env.ledger().timestamp();

        // Check lock period
        if now < stake_info.staked_at + MIN_LOCK_SECONDS {
            return Err(StakingError::LockPeriodActive);
        }

        let unstake_amount = if amount <= 0 { stake_info.amount } else { amount };

        if unstake_amount > stake_info.amount {
            return Err(StakingError::InsufficientStake);
        }

        let token_address: Address = env.storage().instance().get(&DataKey::TokenAddress).unwrap();
        let token_client = token::Client::new(&env, &token_address);

        // Claim pending rewards first
        let pending = Self::calculate_pending_rewards(&env, &staker, now);
        if pending > 0 {
            Self::distribute_reward(&env, &token_client, &staker, pending);
        }

        // Transfer staked tokens back to staker
        token_client.transfer(&env.current_contract_address(), &staker, &unstake_amount);

        let remaining = stake_info.amount - unstake_amount;
        if remaining > 0 {
            let new_tier = Self::calculate_tier(remaining);
            let corridor_count = match new_tier {
                Tier::Bronze => 1,
                Tier::Silver => 3,
                Tier::Gold => 100,
                Tier::None => 0,
            };
            let updated_info = StakeInfo {
                amount: remaining,
                tier: new_tier,
                staked_at: stake_info.staked_at,
                last_claimed: now,
                corridor_count,
            };
            env.storage().persistent().set(&DataKey::Stake(staker.clone()), &updated_info);
        } else {
            env.storage().persistent().remove(&DataKey::Stake(staker.clone()));
        }

        // Update total staked
        let total_staked: i128 = env.storage().instance().get(&DataKey::TotalStaked).unwrap();
        env.storage().instance().set(&DataKey::TotalStaked, &(total_staked - unstake_amount));

        Ok(unstake_amount + pending)
    }

    /// Claim pending staking rewards without unstaking.
    ///
    /// # Arguments
    /// - `staker` - Address of the staker (must authorize)
    pub fn claim_rewards(
        env: Env,
        staker: Address,
    ) -> Result<i128, StakingError> {
        Self::require_initialized(&env)?;
        staker.require_auth();

        let mut stake_info: StakeInfo = env
            .storage()
            .persistent()
            .get(&DataKey::Stake(staker.clone()))
            .ok_or(StakingError::NoStakeFound)?;

        let now = env.ledger().timestamp();
        let pending = Self::calculate_pending_rewards(&env, &staker, now);

        if pending <= 0 {
            return Ok(0);
        }

        let token_address: Address = env.storage().instance().get(&DataKey::TokenAddress).unwrap();
        let token_client = token::Client::new(&env, &token_address);

        Self::distribute_reward(&env, &token_client, &staker, pending);

        // Update last claimed timestamp
        stake_info.last_claimed = now;
        env.storage().persistent().set(&DataKey::Stake(staker.clone()), &stake_info);

        Ok(pending)
    }

    /// Admin: Fund the reward pool with RMTAI tokens.
    ///
    /// # Arguments
    /// - `admin` - Admin address (must authorize)
    /// - `amount` - Amount of RMTAI to add to reward pool
    pub fn fund_rewards(
        env: Env,
        admin: Address,
        amount: i128,
    ) -> Result<i128, StakingError> {
        Self::require_admin(&env, &admin)?;
        admin.require_auth();

        let token_address: Address = env.storage().instance().get(&DataKey::TokenAddress).unwrap();
        let token_client = token::Client::new(&env, &token_address);

        token_client.transfer(&admin, &env.current_contract_address(), &amount);

        let reward_pool: i128 = env.storage().instance().get(&DataKey::RewardPool).unwrap();
        let new_pool = reward_pool + amount;
        env.storage().instance().set(&DataKey::RewardPool, &new_pool);

        Ok(new_pool)
    }

    // --- View functions ---

    /// Get stake info for an address.
    pub fn get_stake(env: Env, staker: Address) -> Result<StakeInfo, StakingError> {
        Self::require_initialized(&env)?;
        env.storage()
            .persistent()
            .get(&DataKey::Stake(staker))
            .ok_or(StakingError::NoStakeFound)
    }

    /// Get pending (unclaimed) rewards for a staker.
    pub fn get_pending_rewards(env: Env, staker: Address) -> Result<i128, StakingError> {
        Self::require_initialized(&env)?;
        let now = env.ledger().timestamp();
        Ok(Self::calculate_pending_rewards(&env, &staker, now))
    }

    /// Get the total amount of RMTAI staked across all stakers.
    pub fn get_total_staked(env: Env) -> Result<i128, StakingError> {
        Self::require_initialized(&env)?;
        Ok(env.storage().instance().get(&DataKey::TotalStaked).unwrap())
    }

    /// Get the current reward pool balance.
    pub fn get_reward_pool(env: Env) -> Result<i128, StakingError> {
        Self::require_initialized(&env)?;
        Ok(env.storage().instance().get(&DataKey::RewardPool).unwrap())
    }

    /// Get the tier for a given staked amount.
    pub fn get_tier_for_amount(_env: Env, amount: i128) -> Tier {
        Self::calculate_tier(amount)
    }

    // --- Internal helpers ---

    fn require_initialized(env: &Env) -> Result<(), StakingError> {
        if !env.storage().instance().has(&DataKey::Initialized) {
            return Err(StakingError::NotInitialized);
        }
        Ok(())
    }

    fn require_admin(env: &Env, caller: &Address) -> Result<(), StakingError> {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        if *caller != admin {
            return Err(StakingError::NotAdmin);
        }
        Ok(())
    }

    fn calculate_tier(amount: i128) -> Tier {
        if amount >= GOLD_MIN {
            Tier::Gold
        } else if amount >= SILVER_MIN {
            Tier::Silver
        } else if amount >= BRONZE_MIN {
            Tier::Bronze
        } else {
            Tier::None
        }
    }

    fn get_staked_amount(env: &Env, staker: &Address) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::Stake(staker.clone()))
            .map(|info: StakeInfo| info.amount)
            .unwrap_or(0)
    }

    fn calculate_pending_rewards(env: &Env, staker: &Address, now: u64) -> i128 {
        let stake_info: Option<StakeInfo> = env
            .storage()
            .persistent()
            .get(&DataKey::Stake(staker.clone()));

        match stake_info {
            None => 0,
            Some(info) => {
                let elapsed = now.saturating_sub(info.last_claimed);
                if elapsed == 0 {
                    return 0;
                }

                let apy_bps = match info.tier {
                    Tier::Bronze => BRONZE_APY_BPS,
                    Tier::Silver => SILVER_APY_BPS,
                    Tier::Gold => GOLD_APY_BPS,
                    Tier::None => 0,
                };

                // reward = staked_amount * apy_bps / 10000 * elapsed / seconds_per_year
                let reward = info.amount * apy_bps as i128 * elapsed as i128
                    / (10000 * SECONDS_PER_YEAR as i128);

                reward
            }
        }
    }

    fn distribute_reward(env: &Env, token_client: &token::Client, staker: &Address, amount: i128) {
        let reward_pool: i128 = env.storage().instance().get(&DataKey::RewardPool).unwrap();

        // Only distribute up to what's in the pool
        let actual = if amount > reward_pool { reward_pool } else { amount };
        if actual <= 0 {
            return;
        }

        token_client.transfer(&env.current_contract_address(), staker, &actual);
        env.storage().instance().set(&DataKey::RewardPool, &(reward_pool - actual));
    }
}

#[cfg(test)]
mod test {
    // Tests would go here using soroban-sdk testutils
    // For now, contract is tested via manual testnet deployment
}
