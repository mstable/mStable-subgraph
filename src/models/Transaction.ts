import { SwapTransaction, Basset, FeePaidTransaction } from './../../generated/schema'
import { Swapped, PaidFee } from './../../generated/MUSD/Masset'
import { toDecimal, RATIO } from '../utils/number'

export function getOrCreateSwapTransaction(event: Swapped): SwapTransaction {
  let txHash = event.transaction.hash
  let type = 'SWAP'
  let id = txHash.toHexString().concat(type)
  let transaction = SwapTransaction.load(id)

  if (transaction != null) {
    return transaction as SwapTransaction
  }

  transaction = new SwapTransaction(id)
  transaction.tx = txHash
  transaction.type = type
  transaction.mAsset = event.address.toHex()
  let outputBasset = Basset.load(event.params.output.toHexString())
  let ratioedOutputAmount = event.params.outputAmount.times(outputBasset.ratio).div(RATIO)
  transaction.mAssetUnits = toDecimal(ratioedOutputAmount, 18)
  transaction.timestamp = event.block.timestamp.toI32()
  transaction.sender = event.params.swapper
  transaction.inputBasset = event.params.input.toHexString()
  transaction.outputBasset = event.params.output.toHexString()
  transaction.recipient = event.params.recipient
  transaction.save()
  return transaction as SwapTransaction
}

export function getOrCreateFeePaidTransaction(event: PaidFee): FeePaidTransaction {
  let txHash = event.transaction.hash
  let type = 'PAIDFEE'
  let id = txHash.toHexString().concat(type)
  let transaction = FeePaidTransaction.load(id)

  if (transaction != null) {
    return transaction as FeePaidTransaction
  }

  transaction = new FeePaidTransaction(id)
  transaction.tx = txHash
  transaction.type = type
  transaction.mAsset = event.address.toHex()
  let paidInBasset = Basset.load(event.params.asset.toHexString())
  let ratioedOutputAmount = event.params.feeQuantity.times(paidInBasset.ratio).div(RATIO)
  transaction.mAssetUnits = toDecimal(ratioedOutputAmount, 18)
  transaction.timestamp = event.block.timestamp.toI32()
  transaction.sender = event.params.payer
  transaction.asset = event.params.asset.toHexString()
  transaction.save()
  return transaction as FeePaidTransaction
}
