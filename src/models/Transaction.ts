import { log, BigInt } from '@graphprotocol/graph-ts'
import { Basset, FeePaidTransaction, SwapTransaction } from './../../generated/schema'
import { PaidFee, Swapped } from './../../generated/MUSD/Masset'
import { RATIO, toDecimal } from '../utils/number'
import { mapTransactionType, TransactionType } from '../enums'

export function getOrCreateSwapTransaction(event: Swapped): SwapTransaction {
  let txHash = event.transaction.hash
  // let type = mapTransactionType(TransactionType.SWAP)
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

export function getOrCreateFeePaidTransaction(event: PaidFee): void {
  let txHash = event.transaction.hash
  // let type = mapTransactionType(TransactionType.PAIDFEE)
  let type = 'PAIDFEE'
  let id = txHash.toHexString().concat(type)
  let transaction = FeePaidTransaction.load(id)

  if (transaction != null) {
    // return transaction as FeePaidTransaction
    return
  }

  transaction = new FeePaidTransaction(id)
  transaction.tx = txHash
  transaction.type = type
  transaction.mAsset = event.address.toHex()
  let paidInBasset = Basset.load(event.params.asset.toHexString())
  log.info("feeQuantity {}", [event.params.feeQuantity.toString()])
  return
  // let ratioedOutputAmount = BigInt.fromI32(<i32>event.params.feeQuantity as i32)
  //   .times(paidInBasset.ratio)
  //   .div(RATIO)
  // transaction.mAssetUnits = toDecimal(ratioedOutputAmount, 18)
  // transaction.timestamp = event.block.timestamp.toI32()
  // transaction.sender = event.params.payer
  // transaction.asset = event.params.asset.toHexString()
  // transaction.save()
  // return transaction as FeePaidTransaction
}
