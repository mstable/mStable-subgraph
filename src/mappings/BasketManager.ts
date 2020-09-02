import { EthereumEvent } from '@graphprotocol/graph-ts'
import {
  BasketManager,
  BasketWeightsUpdated,
  BassetAdded,
  BassetStatusChanged,
  BassetRemoved,
} from '../../generated/BasketManager/BasketManager'
import { upsertBasket } from '../models/Basket'

function updateBasketForBasketManagerEvent<TEvent extends EthereumEvent>(
  event: TEvent,
): void {
  let basketManagerContract = BasketManager.bind(event.address)
  let massetAddress = basketManagerContract.mAsset()
  upsertBasket(massetAddress)
}

export function handleBassetAdded(event: BassetAdded): void {
  updateBasketForBasketManagerEvent(event)
}

export function handleBassetRemoved(event: BassetRemoved): void {
  updateBasketForBasketManagerEvent(event)
}

export function handleBasketWeightsUpdated(event: BasketWeightsUpdated): void {
  updateBasketForBasketManagerEvent(event)
}

export function handleBassetStatusChanged(event: BassetStatusChanged): void {
  updateBasketForBasketManagerEvent(event)
}

export function handleBasketStatusChanged(event: BassetStatusChanged): void {
  updateBasketForBasketManagerEvent(event)
}
