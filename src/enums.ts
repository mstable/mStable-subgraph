export enum TransactionType {
  MASSET_MINT,
  MASSET_SWAP,
  MASSET_REDEEM,
  MASSET_REDEEM_MASSET,
  MASSET_PAID_FEE,
  SAVINGS_CONTRACT_DEPOSIT,
  SAVINGS_CONTRACT_WITHDRAW,
  STAKING_REWARDS_CONTRACT_CLAIM_REWARD,
  STAKING_REWARDS_CONTRACT_EXIT,
  STAKING_REWARDS_CONTRACT_STAKE,
  STAKING_REWARDS_CONTRACT_WITHDRAW,
}

export enum TimeMetricPeriod {
  HOUR,
  DAY,
  WEEK,
  MONTH,
  QUARTER,
  YEAR,
}

export enum AggregateMetricType {
  TOTAL_SUPPLY,
  TOTAL_SAVINGS,
}

export enum StakingRewardsContractType {
  STAKING_REWARDS,
  STAKING_REWARDS_WITH_PLATFORM_TOKEN,
}

export enum StakingRewardType {
  REWARD,
  PLATFORM_REWARD,
}

export function mapStakingRewardsContractType(
  type: StakingRewardsContractType,
): string {
  switch (type) {
    case StakingRewardsContractType.STAKING_REWARDS:
      return 'STAKING_REWARDS'
    case StakingRewardsContractType.STAKING_REWARDS_WITH_PLATFORM_TOKEN:
      return 'STAKING_REWARDS_WITH_PLATFORM_TOKEN'
    default:
      return ''
  }
}

export function mapStakingRewardType(type: StakingRewardType): string {
  switch (type) {
    case StakingRewardType.PLATFORM_REWARD:
      return 'PLATFORM_REWARD'
    case StakingRewardType.REWARD:
      return 'REWARD'
    default:
      return ''
  }
}

export function mapTimeMetricPeriod(period: TimeMetricPeriod): string {
  switch (period) {
    case TimeMetricPeriod.DAY:
      return 'DAY'
    case TimeMetricPeriod.HOUR:
      return 'HOUR'
    case TimeMetricPeriod.WEEK:
      return 'WEEK'
    case TimeMetricPeriod.MONTH:
      return 'MONTH'
    case TimeMetricPeriod.QUARTER:
      return 'QUARTER'
    case TimeMetricPeriod.YEAR:
      return 'YEAR'
    default:
      return ''
  }
}

export function mapTransactionType(type: TransactionType): string {
  switch (type) {
    case TransactionType.MASSET_MINT:
      return 'MASSET_MINT'
    case TransactionType.MASSET_SWAP:
      return 'MASSET_SWAP'
    case TransactionType.MASSET_REDEEM:
      return 'MASSET_REDEEM'
    case TransactionType.MASSET_REDEEM_MASSET:
      return 'MASSET_REDEEM_MASSET'
    case TransactionType.MASSET_PAID_FEE:
      return 'MASSET_PAID_FEE'
    case TransactionType.SAVINGS_CONTRACT_DEPOSIT:
      return 'SAVINGS_CONTRACT_DEPOSIT'
    case TransactionType.SAVINGS_CONTRACT_WITHDRAW:
      return 'SAVINGS_CONTRACT_WITHDRAW'
    case TransactionType.STAKING_REWARDS_CONTRACT_CLAIM_REWARD:
      return 'STAKING_REWARDS_CONTRACT_CLAIM_REWARD'
    case TransactionType.STAKING_REWARDS_CONTRACT_EXIT:
      return 'STAKING_REWARDS_CONTRACT_EXIT'
    case TransactionType.STAKING_REWARDS_CONTRACT_STAKE:
      return 'STAKING_REWARDS_CONTRACT_STAKE'
    case TransactionType.STAKING_REWARDS_CONTRACT_WITHDRAW:
      return 'STAKING_REWARDS_CONTRACT_WITHDRAW'
    default:
      return ''
  }
}

export function mapAggregateMetricType(type: AggregateMetricType): string {
  switch (type) {
    case AggregateMetricType.TOTAL_SAVINGS:
      return 'TOTAL_SAVINGS'
    case AggregateMetricType.TOTAL_SUPPLY:
      return 'TOTAL_SUPPLY'
    default:
      return ''
  }
}
