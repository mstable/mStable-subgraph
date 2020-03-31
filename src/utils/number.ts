import { BigDecimal, BigInt } from '@graphprotocol/graph-ts'

export let ZERO = BigInt.fromI32(0)

// @ts-ignore
export function toDecimal(value: BigInt, decimals: u32): BigDecimal {
  let precision = BigInt.fromI32(10)
    // @ts-ignore
    .pow(<u8>decimals)
    .toBigDecimal()

  return value.divDecimal(precision)
}
