import { EthereumEvent } from '@graphprotocol/graph-ts'
import {
  Minted,
  MintedMulti,
  PaidFee,
  Redeemed,
  RedeemedMasset,
  SwapFeeChanged,
  RedemptionFeeChanged,
  Swapped,
} from '../../generated/MUSD/Masset'
import { Transfer } from '../../generated/MUSD/ERC20Detailed'
import { handleTokenTransfer } from './Token'
import {
  updateMassetSwapFee,
  updateMassetRedemptionFee,
} from '../models/Masset'
import { updateBassets } from '../models/Basset'
import {
  getOrCreateFeePaidTransaction,
  getOrCreateSwapTransaction,
} from '../models/Transaction'
import { appendAggregateMetrics, appendVolumeMetrics } from '../models/Metric'
import { AggregateMetricType, TransactionType } from '../enums'
import { RATIO, toDecimal } from '../utils/number'
import { MASSET_DECIMALS } from '../utils/token'
import { Basset } from '../../generated/schema'
import { getOrCreateToken } from '../models/Token'

function handleMintedEvent<TEvent extends EthereumEvent>(event: TEvent): void {
  // A `Transfer` event should have been emitted; the handler for that
  // event will adjust the Masset token balance and total supply.
  // Basset token events are not tracked.

  // Update vault balances
  updateBassets(event.address)
}

function handleRedeemedEvent<TEvent extends EthereumEvent>(
  event: TEvent,
): void {
  // A `Transfer` event should also have been emitted; the handler for that
  // event will adjust the Masset token balance and total supply.
  // Basset token events are not tracked.

  // Update vault balances
  updateBassets(event.address)
}

export function handleMinted(event: Minted): void {
  handleMintedEvent(event)

  appendVolumeMetrics(
    TransactionType.MASSET_MINT,
    toDecimal(event.params.mAssetQuantity, MASSET_DECIMALS),
    event.block.timestamp,
  )
}

export function handleMintedMulti(event: MintedMulti): void {
  handleMintedEvent(event)

  appendVolumeMetrics(
    TransactionType.MASSET_MINT,
    toDecimal(event.params.mAssetQuantity, MASSET_DECIMALS),
    event.block.timestamp,
  )
}

export function handleSwapped(event: Swapped): void {
  getOrCreateSwapTransaction(event)
  // Update vault balances
  updateBassets(event.address)

  let outputBasset = Basset.load(event.params.output.toHexString())
  let ratioedOutputAmount = event.params.outputAmount
    .times(outputBasset.ratio)
    .div(RATIO)

  appendVolumeMetrics(
    TransactionType.MASSET_SWAP,
    toDecimal(ratioedOutputAmount, MASSET_DECIMALS),
    event.block.timestamp,
  )
}

export function handleRedeemed(event: Redeemed): void {
  handleRedeemedEvent(event)

  appendVolumeMetrics(
    TransactionType.MASSET_REDEEM,
    toDecimal(event.params.mAssetQuantity, MASSET_DECIMALS),
    event.block.timestamp,
  )
}

export function handleRedeemedMasset(event: RedeemedMasset): void {
  handleRedeemedEvent(event)

  appendVolumeMetrics(
    TransactionType.MASSET_REDEEM_MASSET,
    toDecimal(event.params.mAssetQuantity, MASSET_DECIMALS),
    event.block.timestamp,
  )
}

export function handlePaidFee(event: PaidFee): void {
  getOrCreateFeePaidTransaction(event)
  // This is handled by the vault balance updating & transfer
}

export function handleSwapFeeChanged(event: SwapFeeChanged): void {
  updateMassetSwapFee(event.address, event.params.fee)
}

export function handleRedemptionFeeChanged(event: RedemptionFeeChanged): void {
  updateMassetRedemptionFee(event.address, event.params.fee)
}

export function handleTransfer(event: Transfer): void {
  handleTokenTransfer(event)

  let token = getOrCreateToken(event.address)

  appendAggregateMetrics(
    AggregateMetricType.TOTAL_SUPPLY,
    token.totalSupply,
    event.block.timestamp,
  )
}
