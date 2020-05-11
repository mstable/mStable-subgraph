import { EthereumEvent } from '@graphprotocol/graph-ts'
import {
  Minted,
  MintedMulti,
  Swapped,
  Redeemed,
  RedeemedMasset,
  PaidFee,
  SwapFeeChanged,
} from '../../generated/MUSD/Masset'
import { Transfer } from '../../generated/MUSD/ERC20Detailed'
import { handleTokenTransfer } from './Token'
import { updateMassetSwapFee } from '../models/Masset'
import { updateBassets } from '../models/Basset'

function handleMintedEvent<TEvent extends EthereumEvent>(event: TEvent): void {
  // A `Transfer` event should have been emitted; the handler for that
  // event will adjust the Masset token balance and total supply.
  // Basset token events are not tracked.

  // Update vault balances
  updateBassets(event.address)
}

function handleRedeemedEvent<TEvent extends EthereumEvent>(event: TEvent): void {
  // A `Transfer` event should also have been emitted; the handler for that
  // event will adjust the Masset token balance and total supply.
  // Basset token events are not tracked.

  // Update vault balances
  updateBassets(event.address)
}

export function handleMinted(event: Minted): void {
  handleMintedEvent(event)
}

export function handleMintedMulti(event: MintedMulti): void {
  handleMintedEvent(event)
}

export function handleSwapped(event: Swapped): void {
  // Update vault balances
  updateBassets(event.address)
}

export function handleRedeemed(event: Redeemed): void {
  handleRedeemedEvent(event)
}

export function handleRedeemedMasset(event: RedeemedMasset): void {
  handleRedeemedEvent(event)
}

export function handlePaidFee(event: PaidFee): void {
  // This is handled by the vault balance updating & transfer
}

export function handleSwapFeeChanged(event: SwapFeeChanged): void {
  updateMassetSwapFee(event.address, event.params.fee)
}

export function handleTransfer(event: Transfer): void {
  handleTokenTransfer(event)
}
