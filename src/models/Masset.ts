import { Address, BigInt } from '@graphprotocol/graph-ts'
import { Masset } from '../../generated/schema'
import { Masset as MassetContract } from '../../generated/MUSD/Masset'
import { getOrCreateToken } from './Token'
import { getOrCreateBasket } from './Basket'

export function upsertMasset(address: Address): Masset {
  let masset = new Masset(address.toHex())
  let contract = MassetContract.bind(address)
  let token = getOrCreateToken(address)
  let basket = getOrCreateBasket(address)

  masset.feeRate = contract.redemptionFee()
  masset.feePool = contract.feeRecipient()
  masset.token = token.id
  masset.tokenSymbol = token.symbol
  masset.basket = basket.id
  masset.save()

  return masset
}

export function getOrCreateMasset(address: Address): Masset {
  let masset = Masset.load(address.toHex())
  if (masset != null) {
    return masset as Masset
  }

  return upsertMasset(address)
}

export function updateMassetFeePool(address: Address, feePool: Address): void {
  let masset = getOrCreateMasset(address)
  masset.feePool = feePool
  masset.save()
}

export function updateMassetRedemptionFee(address: Address, feeRate: BigInt): void {
  let masset = getOrCreateMasset(address)
  masset.feeRate = feeRate
  masset.save()
}
