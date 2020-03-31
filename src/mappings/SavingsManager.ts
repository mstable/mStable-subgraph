import {
  SavingsContractEnabled,
  SavingsRateChanged,
  InterestCollected,
  InterestDistributed,
  InterestWithdrawnByGovernor,
} from '../../generated/SavingsManager/SavingsManager'
import { SavingsContract } from '../../generated/templates'
import { getOrCreateMasset } from '../models/Masset'
import {
  getOrCreateSavingsContract,
  updateSavingsContractSavingsRate,
} from '../models/SavingsContract'

export function handleSavingsContractEnabled(event: SavingsContractEnabled): void {
  let massetAddress = event.params.mAsset
  let savingsContractAddress = event.params.savingsContract

  // Start tracking savings contract events
  SavingsContract.create(savingsContractAddress)

  // Create the savings contract entity and set the masset
  let savingsContract = getOrCreateSavingsContract(savingsContractAddress)
  savingsContract.masset = massetAddress.toHexString()
  savingsContract.save()

  // Create the masset if it doesn't exist already
  let masset = getOrCreateMasset(massetAddress)
  masset.save()
}

export function handleSavingsRateChanged(event: SavingsRateChanged): void {
  let savingsContract = updateSavingsContractSavingsRate(
    event.address,
    event.params.newSavingsRate,
  )
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
