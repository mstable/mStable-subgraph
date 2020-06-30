import { Address, BigInt } from '@graphprotocol/graph-ts'
import { VaultBalance } from '../../generated/schema'

export function getVaultBalanceId(
  rewardsVault: Address,
  account: Address,
  period: i32,
): string {
  return rewardsVault.toHexString() + account.toHexString() + (period as string)
}

export function getOrCreateVaultBalance(
  rewardsVault: Address,
  account: Address,
  period: i32,
): VaultBalance {
  let id = getVaultBalanceId(rewardsVault, account, period)

  let vaultBalance = VaultBalance.load(id)

  if (vaultBalance != null) {
    return vaultBalance as VaultBalance
  }

  {
    let vaultBalance = new VaultBalance(id)

    vaultBalance.account = account
    vaultBalance.rewardsVault = rewardsVault.toHexString()
    vaultBalance.amount = BigInt.fromI32(0)
    vaultBalance.period = period
    vaultBalance.vested = false

    vaultBalance.save()

    return vaultBalance as VaultBalance
  }
}
