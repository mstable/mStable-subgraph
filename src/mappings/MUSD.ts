import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
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
  getOrCreateMasset,
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

function handleMint(massetAddress: Address, massetQuantity: BigInt): void {
  // Update vault balances
  updateBassets(massetAddress)

  let masset = getOrCreateMasset(massetAddress)
  masset.totalMinted = masset.totalMinted.plus(toDecimal(massetQuantity, 18))
  masset.save()
}

function handleRedeem(massetAddress: Address, massetQuantity: BigInt): void {
  // Update vault balances
  updateBassets(massetAddress)

  let masset = getOrCreateMasset(massetAddress)
  masset.totalRedeemed = masset.totalRedeemed.plus(
    toDecimal(massetQuantity, 18),
  )
  masset.save()
}

export function handleMinted(event: Minted): void {
  handleMint(event.address, event.params.mAssetQuantity)

  appendVolumeMetrics(
    TransactionType.MASSET_MINT,
    toDecimal(event.params.mAssetQuantity, MASSET_DECIMALS),
    event.block.timestamp,
  )
}

export function handleMintedMulti(event: MintedMulti): void {
  handleMint(event.address, event.params.mAssetQuantity)

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

  let inputBasset = Basset.load(event.params.input.toHexString())
  let outputBasset = Basset.load(event.params.output.toHexString())
  let ratioedOutputAmount = event.params.outputAmount
    .times(outputBasset.ratio)
    .div(RATIO)

  let masset = getOrCreateMasset(event.address)

  // For transactions calling swap directly, we can determine the fee paid
  // by decoding the input amount and comparing it to the output amount
  // (in masset units)
  let data = event.transaction.input.toHexString()
  let methodId = data.slice(0, 10)

  // 0x6e81221c == swap(address,address,uint256,address)
  if (methodId == '0x6e81221c') {
    let inputAmountBytes = Bytes.fromHexString(
      data
        .slice(10) // remove methodId
        .slice(128, 64), // 3rd field (input amount)
    ) as Bytes

    let inputAmount = BigInt.fromSignedBytes(inputAmountBytes)

    let ratioedInputAmount = inputAmount.times(inputBasset.ratio).div(RATIO)

    let feeAmount = ratioedOutputAmount.minus(ratioedInputAmount)

    masset.totalSwapFeesPaid = masset.totalSwapFeesPaid.plus(
      toDecimal(feeAmount, MASSET_DECIMALS),
    )
  }

  masset.totalSwapped = masset.totalSwapped.plus(
    toDecimal(ratioedOutputAmount, MASSET_DECIMALS),
  )
  masset.save()

  appendVolumeMetrics(
    TransactionType.MASSET_SWAP,
    toDecimal(ratioedOutputAmount, MASSET_DECIMALS),
    event.block.timestamp,
  )
}

export function handleRedeemed(event: Redeemed): void {
  handleRedeem(event.address, event.params.mAssetQuantity)

  appendVolumeMetrics(
    TransactionType.MASSET_REDEEM,
    toDecimal(event.params.mAssetQuantity, MASSET_DECIMALS),
    event.block.timestamp,
  )
}

export function handleRedeemedMasset(event: RedeemedMasset): void {
  handleRedeem(event.address, event.params.mAssetQuantity)

  appendVolumeMetrics(
    TransactionType.MASSET_REDEEM_MASSET,
    toDecimal(event.params.mAssetQuantity, MASSET_DECIMALS),
    event.block.timestamp,
  )
}

export function handlePaidFee(event: PaidFee): void {
  getOrCreateFeePaidTransaction(event)
  // This is handled by the vault balance updating & transfer

  let masset = getOrCreateMasset(event.address)

  let paidInBasset = Basset.load(event.params.asset.toHexString())
  let ratioedOutputAmount = event.params.feeQuantity
    .times(paidInBasset.ratio)
    .div(RATIO)

  masset.totalRedemptionFeesPaid = masset.totalRedemptionFeesPaid.plus(
    toDecimal(ratioedOutputAmount, MASSET_DECIMALS),
  )
  masset.save()
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
