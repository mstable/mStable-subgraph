// Via https://github.com/graphprotocol/erc20-subgraph/blob/master/src/mappings/account.ts

import { BigInt } from '@graphprotocol/graph-ts'
import { Account, AccountBalance, Token } from '../../generated/schema'
import { toDecimal, ZERO } from '../utils/number'

export function getOrCreateAccountBalance(
  account: Account,
  token: Token,
): AccountBalance {
  let balanceId = account.id + '-' + token.id
  let previousBalance = AccountBalance.load(balanceId)

  if (previousBalance != null) {
    return previousBalance as AccountBalance
  }

  let newBalance = new AccountBalance(balanceId)
  newBalance.account = account.id
  newBalance.token = token.id
  newBalance.amount = ZERO.toBigDecimal()

  return newBalance
}

export function increaseAccountBalance(
  account: Account,
  token: Token,
  quantity: BigInt,
): AccountBalance {
  let balance = getOrCreateAccountBalance(account, token)
  let amount = toDecimal(quantity, token.decimals)
  balance.amount = balance.amount.plus(amount)

  return balance
}

export function decreaseAccountBalance(
  account: Account,
  token: Token,
  quantity: BigInt,
): AccountBalance {
  let balance = getOrCreateAccountBalance(account, token)
  let amount = toDecimal(quantity, token.decimals)
  balance.amount = balance.amount.minus(amount)

  return balance
}
