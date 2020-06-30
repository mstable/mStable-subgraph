import { Address } from '@graphprotocol/graph-ts'

import { getOrCreateStakingReward } from '../../models/StakingReward'
import { StakingRewardsContractType, StakingRewardType } from '../../enums'
import {
  getOrCreateStakingRewardsContract,
  getTotalRewards,
  isWithPlatformToken,
} from '../../models/StakingRewardsContract'
import { StakingRewards } from '../../../generated/templates/StakingRewards/StakingRewards'
import { StakingRewardsWithPlatformToken } from '../../../generated/templates/StakingRewardsWithPlatformToken/StakingRewardsWithPlatformToken'
import { getOrCreateRewardsVault } from '../../models/RewardsVault'

import { RewardsVault as RewardsVaultTemplate } from '../../../generated/templates'
import { getOrCreateStakingBalance } from '../../models/StakingBalance'

function updateStakingRewards(
  contractAddress: Address,
  type: StakingRewardsContractType,
): void {
  let contract = StakingRewards.bind(contractAddress)

  let stakingRewards = getOrCreateStakingRewardsContract(contractAddress, type)

  let rewardRate = contract.rewardRate()
  let duration = stakingRewards.duration

  stakingRewards.lastUpdateTime = contract.lastUpdateTime().toI32()
  stakingRewards.periodFinish = contract.periodFinish().toI32()

  stakingRewards.rewardRate = rewardRate
  stakingRewards.rewardPerTokenStored = contract.rewardPerTokenStored()
  stakingRewards.totalStakingRewards = getTotalRewards(rewardRate, duration)
  stakingRewards.totalSupply = contract.totalSupply()

  if (isWithPlatformToken(type)) {
    let contract = StakingRewardsWithPlatformToken.bind(contractAddress)

    let platformRewardRate = contract.platformRewardRate()

    stakingRewards.platformRewardRate = platformRewardRate
    stakingRewards.platformRewardPerTokenStored = contract.platformRewardPerTokenStored()
    stakingRewards.totalPlatformRewards = getTotalRewards(
      platformRewardRate,
      duration,
    )
  }

  stakingRewards.save()
}

function updateUserRewards(
  contractAddress: Address,
  type: StakingRewardsContractType,
  user: Address,
): void {
  {
    let contract = StakingRewards.bind(contractAddress)

    let reward = getOrCreateStakingReward(
      contractAddress,
      user,
      StakingRewardType.REWARD,
    )
    reward.amount = contract.rewards(user)
    reward.amountPerTokenPaid = contract.userRewardPerTokenPaid(user)
    reward.save()
  }

  if (isWithPlatformToken(type)) {
    let contract = StakingRewardsWithPlatformToken.bind(contractAddress)

    let reward = getOrCreateStakingReward(
      contractAddress,
      user,
      StakingRewardType.PLATFORM_REWARD,
    )
    reward.amount = contract.platformRewards(user)
    reward.amountPerTokenPaid = contract.userPlatformRewardPerTokenPaid(user)
    reward.save()
  }
}

function updateUserStakingBalance(
  contractAddress: Address,
  type: StakingRewardsContractType,
  user: Address,
): void {
  let contract = StakingRewards.bind(contractAddress)

  let amount = contract.balanceOf(user)

  let stakingBalance = getOrCreateStakingBalance(user, contractAddress)

  stakingBalance.amount = amount
  stakingBalance.save()
}

export function handleStakedForType(
  contractAddress: Address,
  type: StakingRewardsContractType,
  user: Address,
): void {
  updateStakingRewards(contractAddress, type)
  updateUserRewards(contractAddress, type, user)
  updateUserStakingBalance(contractAddress, type, user)
}

export function handleRewardAddedForType(
  contractAddress: Address,
  type: StakingRewardsContractType,
): void {
  updateStakingRewards(contractAddress, type)
}

export function handleWithdrawnForType(
  contractAddress: Address,
  type: StakingRewardsContractType,
  user: Address,
): void {
  updateStakingRewards(contractAddress, type)
  updateUserRewards(contractAddress, type, user)
  updateUserStakingBalance(contractAddress, type, user)
}

export function handleRewardPaidForType(
  contractAddress: Address,
  type: StakingRewardsContractType,
  user: Address,
): void {
  updateStakingRewards(contractAddress, type)
  updateUserRewards(contractAddress, type, user)
  updateUserStakingBalance(contractAddress, type, user)
}

export function handleRewardsVaultSetForType(
  contractAddress: Address,
  type: StakingRewardsContractType,
  newVault: Address,
): void {
  // Update the `rewardsVault` property
  {
    let stakingRewards = getOrCreateStakingRewardsContract(
      contractAddress,
      StakingRewardsContractType.STAKING_REWARDS,
    )
    stakingRewards.rewardsVault = newVault.toHexString()
    stakingRewards.save()
  }

  // Track the new `RewardsVault` contract and create the entity
  {
    getOrCreateRewardsVault(newVault)
    RewardsVaultTemplate.create(newVault)
  }
}
