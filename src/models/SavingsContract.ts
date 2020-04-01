import { Address, BigInt } from '@graphprotocol/graph-ts'
import { SavingsContract } from '../../generated/schema'
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

export function increaseSavingsContractTotalSavings(
  address: Address,
  amount: BigInt,
): SavingsContract {
  let savingsContract = getOrCreateSavingsContract(address)

  savingsContract.totalSavings = savingsContract.totalSavings.plus(
    toDecimal(amount, DECIMALS),
  )

  return savingsContract
}

export function increaseSavingsContractTotalCredits(
  address: Address,
  amount: BigInt,
): SavingsContract {
  let savingsContract = getOrCreateSavingsContract(address)

  savingsContract.totalCredits = savingsContract.totalCredits.plus(
    toDecimal(amount, DECIMALS),
  )

  return savingsContract
}

export function decreaseSavingsContractTotalSavings(
  address: Address,
  amount: BigInt,
): SavingsContract {
  let savingsContract = getOrCreateSavingsContract(address)

  savingsContract.totalSavings = savingsContract.totalSavings.minus(
    toDecimal(amount, DECIMALS),
  )

  return savingsContract
}

export function decreaseSavingsContractTotalCredits(
  address: Address,
  amount: BigInt,
): SavingsContract {
  let savingsContract = getOrCreateSavingsContract(address)

  savingsContract.totalCredits = savingsContract.totalCredits.minus(
    toDecimal(amount, DECIMALS),
  )

  return savingsContract
}

export function updateSavingsContractSavingsRate(
  address: Address,
  amount: BigInt,
): SavingsContract {
  let savingsContract = getOrCreateSavingsContract(address)

  savingsContract.savingsRate = toDecimal(amount, SAVINGS_RATE_DECIMALS)

  return savingsContract
}
