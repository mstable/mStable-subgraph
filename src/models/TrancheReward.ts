import { Address } from '@graphprotocol/graph-ts'
import { Tranche, TrancheReward } from '../../generated/schema'
import { ForgeRewardsMUSD } from '../../generated/ForgeRewardsMUSD/ForgeRewardsMUSD'

function getTrancheRewardId(tranche: Tranche, rewardee: Address): string {
  return tranche.id.concat('-').concat(rewardee.toHexString())
}

export function updateTrancheRewardees(
  forgeAddress: Address,
  tranche: Tranche,
): TrancheReward[] {
  let contract = ForgeRewardsMUSD.bind(forgeAddress)
  let rewardees = tranche.rewardees as Address[]
  let data = contract.getRewardeesData(tranche.trancheNumber, rewardees)

  let rewards: TrancheReward[] = []

  for (let i = 0; i < rewardees.length; i++) {
    let rewardee = rewardees[i]
    let reward = new TrancheReward(getTrancheRewardId(tranche, rewardee))

    reward.rewardee = rewardee
    reward.mintVolume = data.value0[i]
    reward.claimed = data.value1[i]
    reward.allocation = data.value2[i]
    reward.redeemed = data.value3[i]

    reward.save()

    rewards.push(reward)
  }

  return rewards
}
