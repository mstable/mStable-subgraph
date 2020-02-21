// Via https://github.com/graphprotocol/erc20-subgraph/blob/master/src/mappings/account.ts

import { Bytes } from '@graphprotocol/graph-ts'
import { Account } from '../../generated/schema'

export function getOrCreateAccount(accountAddress: Bytes): Account {
  let accountId = accountAddress.toHex()
  let existingAccount = Account.load(accountId)

  if (existingAccount != null) {
    return existingAccount as Account
  }

  let newAccount = new Account(accountId)
  newAccount.address = accountAddress

  return newAccount
}
