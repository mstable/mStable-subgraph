import { BigDecimal, BigInt } from '@graphprotocol/graph-ts'

export let ZERO = BigInt.fromI32(0)
export let RATIO = BigInt.fromI32(100000000)

export function toDecimal(value: BigInt, decimals: u32): BigDecimal {
  let precision = BigInt.fromI32(10)
    .pow(<u8>decimals)
    .toBigDecimal()

  return value.divDecimal(precision)
}
