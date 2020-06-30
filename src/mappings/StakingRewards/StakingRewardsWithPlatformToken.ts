import {
  RewardAdded,
  RewardPaid,
  RewardsVaultSet,
  Staked,
  Withdrawn,
} from '../../../generated/templates/StakingRewardsWithPlatformToken/StakingRewardsWithPlatformToken'
import { StakingRewardsContractType } from '../../enums'
import {
  handleRewardAddedForType,
  handleStakedForType,
  handleRewardsVaultSetForType,
  handleRewardPaidForType,
  handleWithdrawnForType,
} from './shared'

export function handleRewardAdded(event: RewardAdded): void {
  handleRewardAddedForType(
    event.address,
    StakingRewardsContractType.STAKING_REWARDS_WITH_PLATFORM_TOKEN,
  )
}

export function handleStaked(event: Staked): void {
  handleStakedForType(
    event.address,
    StakingRewardsContractType.STAKING_REWARDS_WITH_PLATFORM_TOKEN,
    event.params.user,
  )
}

export function handleWithdrawn(event: Withdrawn): void {
  handleWithdrawnForType(
    event.address,
    StakingRewardsContractType.STAKING_REWARDS_WITH_PLATFORM_TOKEN,
    event.params.user,
  )
}

export function handleRewardPaid(event: RewardPaid): void {
  handleRewardPaidForType(
    event.address,
    StakingRewardsContractType.STAKING_REWARDS_WITH_PLATFORM_TOKEN,
    event.params.user,
  )
}

export function handleRewardsVaultSet(event: RewardsVaultSet): void {
  handleRewardsVaultSetForType(
    event.address,
    StakingRewardsContractType.STAKING_REWARDS_WITH_PLATFORM_TOKEN,
    event.params.newVault,
  )
}
