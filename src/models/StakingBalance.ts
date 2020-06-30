import { Address, BigInt } from '@graphprotocol/graph-ts'
import { StakingBalance } from '../../generated/schema'

export function getOrCreateStakingBalance(
  account: Address,
  contractAddress: Address,
): StakingBalance {
  let id = contractAddress.toHexString() + account.toHexString()

  let stakingBalance = StakingBalance.load(id)

  if (stakingBalance != null) {
    return stakingBalance as StakingBalance
  }

  {
    let stakingBalance = new StakingBalance(id)

    stakingBalance.account = account
    stakingBalance.amount = BigInt.fromI32(0)
    stakingBalance.stakingRewardsContract = contractAddress.toHexString()

    stakingBalance.save()

    return stakingBalance as StakingBalance
  }
}
