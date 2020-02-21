import { Address, BigInt } from '@graphprotocol/graph-ts'
import { Masset } from '../../generated/schema'
import { Masset as MassetContract } from '../../generated/templates/Masset/Masset'
import { getOrCreateToken } from './Token'
import { getOrCreateBasket } from './Basket'

export function getOrCreateMasset(address: Address): Masset {
  let masset = Masset.load(address.toHex())
  if (masset != null) {
    return masset as Masset
  }

  return upsertMasset(address)
}

export function upsertMasset(address: Address): Masset {
  let masset = new Masset(address.toHex())
  let contract = MassetContract.bind(address)
  let token = getOrCreateToken(address)
  let basket = getOrCreateBasket(address)

  masset.redemptionFee = contract.redemptionFee()
  masset.feePool = contract.feePool()
  masset.token = token.id
  masset.basket = basket.id
  masset.tranches = []
  masset.save()

  return masset
}

export function updateMassetFeePool(address: Address, feePool: Address): void {
  let masset = getOrCreateMasset(address)
  masset.feePool = feePool
  masset.save()
}

export function updateMassetRedemptionFee(address: Address, redemptionFee: BigInt): void {
  let masset = getOrCreateMasset(address)
  masset.redemptionFee = redemptionFee
  masset.save()
}
