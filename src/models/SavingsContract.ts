import { Address, BigInt, BigDecimal } from '@graphprotocol/graph-ts'
import { SavingsContract } from '../../generated/schema'
import { SavingsContract as SavingsContractTemplate } from '../../generated/templates/SavingsContract/SavingsContract'
import { toDecimal, ZERO } from '../utils/number'

const DECIMALS = 18
const SAVINGS_RATE_DECIMALS = 16

export function getOrCreateSavingsContract(address: Address): SavingsContract {
  let id = address.toHexString()
  let savingsContract = SavingsContract.load(id)

  if (savingsContract != null) {
    return savingsContract as SavingsContract
  }

  savingsContract = new SavingsContract(id)
  savingsContract.totalCredits = toDecimal(ZERO, DECIMALS)
  savingsContract.totalSavings = toDecimal(ZERO, DECIMALS)
  savingsContract.savingsRate = toDecimal(ZERO, SAVINGS_RATE_DECIMALS)
  savingsContract.automationEnabled = false

  return savingsContract as SavingsContract
}

export function increaseSavingsContractTotalCredits(
  address: Address,
  amount: BigInt,
): void {
  let savingsContract = getOrCreateSavingsContract(address)

  savingsContract.totalCredits = savingsContract.totalCredits.plus(
    toDecimal(amount, DECIMALS),
  )

  savingsContract.save()
}

export function decreaseSavingsContractTotalSavings(
  address: Address,
  amount: BigInt,
): BigDecimal {
  let savingsContract = getOrCreateSavingsContract(address)

  savingsContract.totalSavings = savingsContract.totalSavings.minus(
    toDecimal(amount, DECIMALS),
  )

  savingsContract.save()

  return savingsContract.totalSavings
}

export function decreaseSavingsContractTotalCredits(
  address: Address,
  amount: BigInt,
): void {
  let savingsContract = getOrCreateSavingsContract(address)

  savingsContract.totalCredits = savingsContract.totalCredits.minus(
    toDecimal(amount, DECIMALS),
  )

  savingsContract.save()
}

export function updateSavingsContractSavingsRate(
  address: Address,
  amount: BigInt,
): void {
  let savingsContract = getOrCreateSavingsContract(address)

  savingsContract.savingsRate = toDecimal(amount, SAVINGS_RATE_DECIMALS)

  savingsContract.save()
}

export function updateSavingsContractTotalSavings(
  address: Address,
): BigDecimal {
  let savingsContract = getOrCreateSavingsContract(address)
  let instance = SavingsContractTemplate.bind(address)
  let totalSavings = instance.totalSavings()

  savingsContract.totalSavings = toDecimal(totalSavings, DECIMALS)

  savingsContract.save()

  return savingsContract.totalSavings
}
