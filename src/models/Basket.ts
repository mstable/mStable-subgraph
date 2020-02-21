import { Address, Bytes, BigInt } from '@graphprotocol/graph-ts'
import { Basket, Basset, Token } from '../../generated/schema'
import { Masset as MassetContract } from '../../generated/templates/Masset/Masset'
import { updateBassets } from './Basset'
import { getOrCreateToken } from './Token'

export function getOrCreateBasket(massetAddress: Address): Basket {
  let basket = Basket.load(massetAddress.toHexString())
  if (basket != null) {
    return basket as Basket
  }

  return upsertBasket(massetAddress)
}

export function upsertBasket(massetAddress: Address): Basket {
  let basket = new Basket(massetAddress.toHexString())
  let bassets = updateBassets(massetAddress)
  let contract = MassetContract.bind(massetAddress)
  let unparsedBasket = contract.getBasket()

  basket.bassets = bassets.map<string>((basset: Basset) => basset.id) as string[]
  basket.expiredBassets = unparsedBasket.value0 as Bytes[]
  basket.failed = unparsedBasket.value1
  basket.collateralisationRatio = unparsedBasket.value2

  basket.save()

  return basket
}

export function getBassetToken(massetAddress: Address, index: BigInt): Token {
  let basket = Basket.load(massetAddress.toHexString())
  let bassets = basket.bassets
  let address = bassets[index.toI32()]
  return getOrCreateToken(Address.fromString(address))
}
