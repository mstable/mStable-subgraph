import { Address } from '@graphprotocol/graph-ts'
import { Masset as MassetContract } from '../../generated/MUSD/Masset'
import { BasketManager } from '../../generated/BasketManager/BasketManager'
import { Basset } from '../../generated/schema'
import { getOrCreateToken } from './Token'
import { toDecimal } from '../utils/number'

export function updateBassets(massetAddress: Address): Basset[] {
  let massetContract = MassetContract.bind(massetAddress)
  let basketManagerContract = BasketManager.bind(
    massetContract.getBasketManager(),
  )
  let unparsedBassets = basketManagerContract.getBassets()

  let bassets = new Array<Basset>()
  let length = unparsedBassets.value1.toI32()

  for (let i = 0; i < length; i++) {
    let value0 = unparsedBassets.value0
    let basset = value0[i]

    bassets.push(new Basset(basset.addr.toHexString()))

    let token = getOrCreateToken(basset.addr)

    bassets[i].token = token.id
    bassets[i].ratio = basset.ratio
    bassets[i].maxWeight = basset.maxWeight
    bassets[i].vaultBalance = toDecimal(basset.vaultBalance, token.decimals)
    bassets[i].isTransferFeeCharged = basset.isTransferFeeCharged
    bassets[i].status = mapBassetStatus(basset.status)
    bassets[i].save()
  }

  return bassets
}

function mapBassetStatus(status: u32): string {
  switch (status) {
    case 0:
      return 'Default'
    case 1:
      return 'Normal'
    case 2:
      return 'BrokenBelowPeg'
    case 3:
      return 'BrokenAbovePeg'
    case 4:
      return 'Blacklisted'
    case 5:
      return 'Liquidating'
    case 6:
      return 'Liquidated'
    case 7:
      return 'Failed'
    default:
      throw new Error(`Unknown basset status ${status}`)
  }
}
