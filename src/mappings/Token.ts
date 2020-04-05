import { Token } from '../../generated/schema'
import { Transfer } from '../../generated/MUSD/ERC20Detailed'
import {
  getOrCreateToken,
  decreaseTransferSourceBalance,
  increaseTransferDestinationBalance,
  getTokenTransferAmount,
} from '../models/Token'
import { ZERO_ADDRESS } from '../utils/token'

export function handleTokenTransfer(event: Transfer): void {
  let token = getOrCreateToken(event.address)

  let isMint = event.params.from.toString() === ZERO_ADDRESS
  let isBurn = event.params.to.toString() === ZERO_ADDRESS
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
