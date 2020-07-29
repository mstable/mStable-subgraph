import {
  RewardAdded,
  RewardPaid,
  RewardsVaultSet,
  Staked,
  Withdrawn,
} from '../../../generated/templates/StakingRewards/StakingRewards'
import { StakingRewardsContractType } from '../../enums'
import {
  handleRewardAddedForType,
  handleStakedForType,
  handleRewardsVaultSetForType,
  handleRewardPaidForType,
  handleWithdrawnForType,
} from './shared'
import {
  getOrCreateStakingRewardsContractRewardPaidTransaction,
  getOrCreateStakingRewardsContractWithdrawTransaction,
  getOrCreateStakingRewardsContractStakeTransaction,
} from '../../models/Transaction'

export function handleRewardAdded(event: RewardAdded): void {
  handleRewardAddedForType(
    event.address,
    StakingRewardsContractType.STAKING_REWARDS,
  )
}

export function handleStaked(event: Staked): void {
  handleStakedForType(
    event.address,
    StakingRewardsContractType.STAKING_REWARDS,
    event.params.user,
  )
  getOrCreateStakingRewardsContractStakeTransaction(event)
}

export function handleWithdrawn(event: Withdrawn): void {
  handleWithdrawnForType(
    event.address,
    StakingRewardsContractType.STAKING_REWARDS,
    event.params.user,
  )
  getOrCreateStakingRewardsContractWithdrawTransaction(event)
}

export function handleRewardPaid(event: RewardPaid): void {
  handleRewardPaidForType(
    event.address,
    StakingRewardsContractType.STAKING_REWARDS,
    event.params.user,
  )
  getOrCreateStakingRewardsContractRewardPaidTransaction(event)
}

export function handleRewardsVaultSet(event: RewardsVaultSet): void {
  handleRewardsVaultSetForType(
    event.address,
    StakingRewardsContractType.STAKING_REWARDS,
    event.params.newVault,
  )
}
