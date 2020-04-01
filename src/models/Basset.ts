import { Address } from '@graphprotocol/graph-ts'
import { Masset as MassetContract } from '../../generated/MUSD/Masset'
import { BasketManager } from '../../generated/templates/BasketManager/BasketManager'
import { Basset } from '../../generated/schema'
import { getOrCreateToken } from './Token'
import { toDecimal } from '../utils/number'

export function updateBassets(massetAddress: Address): Basset[] {
  let massetContract = MassetContract.bind(massetAddress)
  let basketManagerContract = BasketManager.bind(massetContract.getBasketManager())
  let unparsedBassets = basketManagerContract.getBassets()

  let bassets = new Array<Basset>()
  let length = unparsedBassets.value2.toI32()

  for (let i = 0; i < length; i++) {
    let value0 = unparsedBassets.value0
    let basset = value0[i]

    bassets.push(new Basset(basset.addr.toHexString()))

    let token = getOrCreateToken(basset.addr)

    bassets[i].token = token.id
    bassets[i].ratio = basset.ratio
    bassets[i].targetWeight = basset.targetWeight
    bassets[i].vaultBalance = toDecimal(basset.vaultBalance, token.decimals)
    bassets[i].isTransferFeeCharged = basset.isTransferFeeCharged
    bassets[i].status = mapBassetStatus(basset.status)
    bassets[i].save()
  }

  return bassets
}

// @ts-ignore
function mapBassetStatus(status: u32): string {
  switch (status) {
    case 0:
      return 'Normal'
    case 1:
      return 'BrokenBelowPeg'
    case 2:
      return 'BrokenAbovePeg'
    case 3:
      return 'BrokenBelowPeg'
    case 4:
      return 'Liquidating'
    case 5:
      return 'Liquidated'
    case 6:
      return 'Failed'
    default:
      throw new Error(`Unknown basset status ${status}`)
  }
}
