import { BigInt, Address, Bytes, log } from '@graphprotocol/graph-ts'
import { Tranche } from '../../generated/schema'
import { ForgeRewardsMUSD } from '../../generated/ForgeRewardsMUSD/ForgeRewardsMUSD'
import { updateTrancheRewardees } from './TrancheReward'
import { getOrCreateMasset } from './Masset'

export function getTrancheId(address: Address, trancheNumber: BigInt): string {
  return address
    .toHexString()
    .concat('-')
    .concat(trancheNumber.toString())
}

export function updateTranche(address: Address, trancheNumber: BigInt): Tranche {
  let id = getTrancheId(address, trancheNumber)
  let tranche = new Tranche(id)

  let contract = ForgeRewardsMUSD.bind(address)
  let trancheData = contract.getTrancheData(trancheNumber)

  tranche.startTime = trancheData.value0
  tranche.endTime = trancheData.value1
  tranche.claimEndTime = trancheData.value2
  tranche.unlockTime = trancheData.value3
  tranche.totalMintVolume = trancheData.value4
  tranche.totalRewardUnits = trancheData.value5
  tranche.unclaimedRewardUnits = trancheData.value6
  tranche.rewardees = trancheData.value7 as Bytes[]
  tranche.trancheNumber = trancheNumber
  tranche.rewards = updateTrancheRewardees(address, tranche).map<string>(
    reward => reward.id,
  )
  tranche.save()

  // Save tranche id to masset to support reverse lookup
  let massetAddress = contract.mUSD()
  let masset = getOrCreateMasset(massetAddress)
  if (!masset.tranches.includes(tranche.id)) {
    masset.tranches = masset.tranches.concat([tranche.id])
    masset.save()
  }

  return tranche
}
