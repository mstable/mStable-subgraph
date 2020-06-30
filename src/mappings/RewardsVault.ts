import { BigInt } from '@graphprotocol/graph-ts'
import {
  AllRewardsUnlocked,
  Deposited,
  Vested,
} from '../../generated/templates/RewardsVault/RewardsVault'
import { VaultBalance } from '../../generated/schema'
import { getOrCreateRewardsVault } from '../models/RewardsVault'
import {
  getOrCreateVaultBalance,
  getVaultBalanceId,
} from '../models/VaultBalance'

export function handleDeposited(event: Deposited): void {
  getOrCreateRewardsVault(event.address)

  let vaultBalance = getOrCreateVaultBalance(
    event.address,
    event.params.rewardee,
    event.params.period.toI32(),
  )

  vaultBalance.amount = vaultBalance.amount.plus(event.params.amount)

  vaultBalance.save()
}

export function handleVested(event: Vested): void {
  getOrCreateRewardsVault(event.address)

  let periods = event.params.period

  for (let i = 0; i < periods.length; i++) {
    let period = periods[i]
    let id = getVaultBalanceId(event.address, event.params.user, period.toI32())

    let vaultBalance = VaultBalance.load(id)

    if (vaultBalance != null) {
      // The amount is left unchanged, because it's now valid as
      // historical information
      vaultBalance.vested = true

      vaultBalance.save()
    }
  }
}

export function handleAllRewardsUnlocked(event: AllRewardsUnlocked): void {
  let rewardsVault = getOrCreateRewardsVault(event.address)
  rewardsVault.allRewardsUnlocked = true
  rewardsVault.save()
}
