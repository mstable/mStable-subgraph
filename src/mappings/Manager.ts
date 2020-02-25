import { MassetAdded, MassetEjected } from '../../generated/Manager/Manager'
import { Masset as MassetTemplate } from '../../generated/templates'
import { getOrCreateMasset } from '../models/Masset'

export function handleMassetAdded(event: MassetAdded): void {
  let address = event.params.addr
  getOrCreateMasset(address)
  MassetTemplate.create(address)
}

export function handleMassetEjected(event: MassetEjected): void {
  // TODO later: handle masset ejected event
}
