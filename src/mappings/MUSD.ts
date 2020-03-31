import { EthereumEvent } from '@graphprotocol/graph-ts'
import {
  Minted,
  MintedMulti,
  Redeemed,
  RedeemedMulti,
  PaidFee,
  RedemptionFeeChanged,
  FeeRecipientChanged,
} from '../../generated/MUSD/MUSD'
import { Transfer } from '../../generated/MUSD/ERC20Detailed'
import { handleTokenTransfer } from './Token'
import { updateMassetFeePool, updateMassetRedemptionFee } from '../models/Masset'
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

export function handleRedeemed(event: Redeemed): void {
  handleRedeemedEvent(event)
}

export function handleRedeemedMulti(event: RedeemedMulti): void {
  handleRedeemedEvent(event)
}

export function handlePaidFee(event: PaidFee): void {
  // This is handled by the Transfer event
}

export function handleRedemptionFeeChanged(event: RedemptionFeeChanged): void {
  updateMassetRedemptionFee(event.address, event.params.fee)
}

export function handleFeeRecipientChanged(event: FeeRecipientChanged): void {
  updateMassetFeePool(event.address, event.params.feePool)
}

export function handleTransfer(event: Transfer): void {
  handleTokenTransfer(event)
}
