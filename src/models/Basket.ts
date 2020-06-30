import { Address, BigInt } from '@graphprotocol/graph-ts'
import { Basket, Basset, Token } from '../../generated/schema'
import { updateBassets } from './Basset'
import { getOrCreateToken } from './Token'
import { BasketManager } from '../../generated/BasketManager/BasketManager'
import { Masset as MassetContract } from '../../generated/MUSD/Masset'

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

  let massetContract = MassetContract.bind(massetAddress)
  let basketManagerContract = BasketManager.bind(
    massetContract.getBasketManager(),
  )
  let basketData = basketManagerContract.getBasket()

  basket.bassets = bassets.map<string>((basset: Basset) => basset.id)
  basket.undergoingRecol = basketData.undergoingRecol
  basket.failed = basketData.failed
  basket.maxBassets = basketData.maxBassets
  basket.collateralisationRatio = basketData.collateralisationRatio
  basket.save()

  return basket
}

export function getBassetToken(massetAddress: Address, index: BigInt): Token {
  let basket = Basket.load(massetAddress.toHexString())
  let bassets = basket.bassets
  let address = bassets[index.toI32()]
  return getOrCreateToken(Address.fromString(address))
}
