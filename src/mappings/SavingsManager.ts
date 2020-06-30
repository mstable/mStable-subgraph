import {
  SavingsContractAdded,
  SavingsRateChanged,
} from '../../generated/SavingsManager/SavingsManager'
import { SavingsContract } from '../../generated/templates'
import { getOrCreateMasset } from '../models/Masset'
import {
  getOrCreateSavingsContract,
  updateSavingsContractSavingsRate,
} from '../models/SavingsContract'

export function handleSavingsContractAdded(event: SavingsContractAdded): void {
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
  updateSavingsContractSavingsRate(event.address, event.params.newSavingsRate)
}
