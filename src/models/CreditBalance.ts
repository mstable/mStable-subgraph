import { BigInt } from '@graphprotocol/graph-ts'
import { Account, CreditBalance, SavingsContract } from '../../generated/schema'
import { toDecimal, ZERO } from '../utils/number'

export function getOrCreateCreditBalance(
  account: Account,
  savingsContract: SavingsContract,
): CreditBalance {
  let balanceId = account.id + '-' + savingsContract.id
  let previousBalance = CreditBalance.load(balanceId)

  if (previousBalance != null) {
    return previousBalance as CreditBalance
  }

  let newBalance = new CreditBalance(balanceId)
  newBalance.account = account.id
  newBalance.savingsContract = savingsContract.id
  newBalance.amount = ZERO.toBigDecimal()

  return newBalance
}

export function increaseCreditBalance(
  account: Account,
  savingsContract: SavingsContract,
  quantity: BigInt,
): CreditBalance {
  let balance = getOrCreateCreditBalance(account, savingsContract)
  let amount = toDecimal(quantity, 18)
  balance.amount = balance.amount.plus(amount)

  return balance
}

export function decreaseCreditBalance(
  account: Account,
  savingsContract: SavingsContract,
  quantity: BigInt,
): CreditBalance {
  let balance = getOrCreateCreditBalance(account, savingsContract)
  let amount = toDecimal(quantity, 18)
  balance.amount = balance.amount.minus(amount)

  return balance
}
