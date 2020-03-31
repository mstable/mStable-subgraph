import { ByteArray, crypto, EthereumEvent } from '@graphprotocol/graph-ts'
import { concat } from '@graphprotocol/graph-ts/helper-functions'

export function getEventId(event: EthereumEvent): string {
  return crypto
    .keccak256(
      concat(
        event.transaction.hash,
        ByteArray.fromI32(event.transactionLogIndex.toI32()),
      ),
    )
    .toHex()
}
