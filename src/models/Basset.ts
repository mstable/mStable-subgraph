import { Address } from '@graphprotocol/graph-ts'
import { Masset as MassetContract } from '../../generated/templates/Masset/Masset'
import { Basset } from '../../generated/schema'
import { getOrCreateToken } from './Token'

export function updateBassets(massetAddress: Address): Basset[] {
  let contract = MassetContract.bind(massetAddress)
  let unparsedBassets = contract.getBassets()

  let bassets = new Array<Basset>()

  for (let i = 0; i < unparsedBassets.value0.length; i++) {
    bassets.push(new Basset(unparsedBassets.value0[i].toHex()))

    let token = getOrCreateToken(unparsedBassets.value0[i])
    bassets[i].token = token.id
    bassets[i].ratio = unparsedBassets.value2[i]
    bassets[i].maxWeight = unparsedBassets.value3[i]
    bassets[i].vaultBalance = unparsedBassets.value4[i]
    bassets[i].status = mapBassetStatus(unparsedBassets.value5[i])
    bassets[i].save()
  }

  return bassets
}

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
