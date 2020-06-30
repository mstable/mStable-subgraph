import { Address } from '@graphprotocol/graph-ts'
import { RewardsVault as RewardsVaultContract } from '../../generated/templates/RewardsVault/RewardsVault'
import { RewardsVault } from '../../generated/schema'

export function getOrCreateRewardsVault(
  contractAddress: Address,
): RewardsVault {
  let id = contractAddress.toHexString()

  let rewardsVault = RewardsVault.load(id)

  if (rewardsVault != null) {
    return rewardsVault as RewardsVault
  }

  {
    let contract = RewardsVaultContract.bind(contractAddress)

    let rewardsVault = new RewardsVault(id)

    rewardsVault.allRewardsUnlocked = false
    rewardsVault.lockupPeriods = contract.LOCKUP_PERIODS().toI32()
    rewardsVault.period = contract.PERIOD().toI32()
    rewardsVault.vaultStartTime = contract.vaultStartTime().toI32()
    rewardsVault.stakingRewardsContract = contractAddress.toHexString()

    // This token contract is not tracked
    rewardsVault.vestingToken = contract.vestingToken().toHexString()

    rewardsVault.save()

    return rewardsVault as RewardsVault
  }
}
