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

  masset.feeRate = contract.swapFee()
  let attempt = contract.try_redemptionFee()
  masset.redemptionFeeRate = attempt.reverted
    ? BigInt.fromI32(0)
    : attempt.value
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

export function updateMassetSwapFee(address: Address, feeRate: BigInt): void {
  let masset = getOrCreateMasset(address)
  masset.feeRate = feeRate
  masset.save()
}

export function updateMassetRedemptionFee(
  address: Address,
  feeRate: BigInt,
): void {
  let masset = getOrCreateMasset(address)
  masset.redemptionFeeRate = feeRate
  masset.save()
}
