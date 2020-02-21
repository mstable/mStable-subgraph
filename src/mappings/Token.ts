import { BigDecimal } from '@graphprotocol/graph-ts'
import { Token } from '../../generated/schema'
import { Transfer } from '../../generated/MTA/ERC20Detailed'
import { getOrCreateAccount } from '../models/Account'
import { decreaseAccountBalance, increaseAccountBalance } from '../models/AccountBalance'
import { getOrCreateToken } from '../models/Token'
import { toDecimal } from '../utils/number'
import { ZERO_ADDRESS } from '../utils/token'

export function handleTokenTransfer(event: Transfer): void {
  let token = getOrCreateToken(event.address)

  let isMint = event.params.from.toHex() === ZERO_ADDRESS
  let isBurn = event.params.to.toHex() === ZERO_ADDRESS
  let isTransfer = !isMint && !isBurn

  if (isMint) {
    handleTokenMintEvent(token, event)
  } else if (isBurn) {
    handleTokenBurnEvent(token, event)
  } else {
    handleTokenTransferEvent(token, event)
  }

  if (isTransfer || isBurn) {
    decreaseTransferSourceBalance(token, event)
  }

  if (isTransfer || isMint) {
    increaseTransferDestinationBalance(token, event)
  }
}

function handleTokenMintEvent(token: Token, event: Transfer): void {
  let amount = getTokenTransferAmount(token, event)
  token.totalSupply = token.totalSupply.plus(amount)
  token.totalMinted = token.totalMinted.plus(amount)
  token.save()
}

function handleTokenBurnEvent(token: Token, event: Transfer): void {
  let amount = getTokenTransferAmount(token, event)
  token.totalBurned = token.totalBurned.plus(amount)
  token.totalSupply = token.totalSupply.minus(amount)
  token.save()
}

function handleTokenTransferEvent(token: Token, event: Transfer): void {
  let amount = getTokenTransferAmount(token, event)
  token.totalTransferred = token.totalTransferred.plus(amount)
  token.save()
}

function decreaseTransferSourceBalance(token: Token, event: Transfer): void {
  let sourceAccount = getOrCreateAccount(event.params.from)
  let accountBalance = decreaseAccountBalance(sourceAccount, token, event.params.value)

  sourceAccount.save()
  accountBalance.save()
}

function increaseTransferDestinationBalance(token: Token, event: Transfer): void {
  let destinationAccount = getOrCreateAccount(event.params.to)
  let accountBalance = increaseAccountBalance(
    destinationAccount,
    token,
    event.params.value,
  )

  destinationAccount.save()
  accountBalance.save()
}

function getTokenTransferAmount(token: Token, event: Transfer): BigDecimal {
  return toDecimal(event.params.value, token.decimals)
}
