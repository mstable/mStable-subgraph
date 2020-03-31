import { BigInt } from '@graphprotocol/graph-ts'
import {
  SavingsContractEnabled,
  SavingsRateChanged,
  InterestCollected,
  InterestDistributed,
  InterestWithdrawnByGovernor,
} from '../../generated/SavingsManager/SavingsManager'
import { SavingsContract as SavingsContractEntity } from '../../generated/schema'
import { SavingsContract } from '../../generated/templates'
import { getOrCreateMasset } from '../models/Masset'
import { toDecimal } from '../utils/number'

export function handleSavingsContractEnabled(event: SavingsContractEnabled): void {
  let massetAddress = event.params.mAsset
  let savingsContractAddress = event.params.savingsContract

  // Start tracking savings contract events
  SavingsContract.create(savingsContractAddress)

  // Create the savings contract entity
  let savingsContractEntity = new SavingsContractEntity(
    savingsContractAddress.toHexString(),
  )
  savingsContractEntity.masset = massetAddress.toHexString()
  savingsContractEntity.totalCredits = toDecimal(BigInt.fromI32(0), 18)
  savingsContractEntity.totalSavings = toDecimal(BigInt.fromI32(0), 18)
  savingsContractEntity.savingsRate = BigInt.fromI32(0) // default FIXME
  savingsContractEntity.automationEnabled = false // default FIXME
  savingsContractEntity.save()

  let masset = getOrCreateMasset(massetAddress)
  masset.save()
}

export function handleSavingsRateChanged(event: SavingsRateChanged): void {
  let savingsContract = SavingsContractEntity.load(event.address.toHexString())
  savingsContract.savingsRate = event.params.newSavingsRate
  savingsContract.save()
}

export function handleInterestCollected(event: InterestCollected): void {
  // A `Transfer` event is emitted, which should suffice
}

export function handleInterestDistributed(event: InterestDistributed): void {
  // A `Transfer` event is emitted, which should suffice
}

export function handleInterestWithdrawnByGovernor(
  event: InterestWithdrawnByGovernor,
): void {
  // A `Transfer` event is emitted, which should suffice
}
