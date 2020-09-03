import { Address, BigDecimal } from '@graphprotocol/graph-ts'
import { Token } from '../../generated/schema'
import { ERC20Detailed, Transfer } from '../../generated/MUSD/ERC20Detailed'
import { toDecimal } from '../utils/number'

export function getOrCreateToken(address: Address): Token {
  let token = Token.load(address.toHexString())
  if (token != null) {
    return token as Token
  }

  return upsertToken(address)
}

export function upsertToken(address: Address): Token {
  let token = new Token(address.toHexString())
  let contract = ERC20Detailed.bind(address)

  token.address = address
  token.name = contract.name()
  token.symbol = contract.symbol()
  token.decimals = contract.decimals()
  token.totalSupply = toDecimal(contract.totalSupply(), token.decimals)
  token.totalMinted = BigDecimal.fromString('0')
  token.totalBurned = BigDecimal.fromString('0')
  token.save()

  return token
}

export function getTokenTransferAmount(
  token: Token,
  event: Transfer,
): BigDecimal {
  return toDecimal(event.params.value, token.decimals)
}
