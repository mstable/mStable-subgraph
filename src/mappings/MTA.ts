import { MinterAdded, MinterRemoved, Transfer } from '../../generated/MTA/Systok'
import { Transfer as ERC20Transfer } from '../../generated/MTA/ERC20Detailed'
import { handleTokenTransfer } from './Token'

export function handleMinterAdded(event: MinterAdded): void {
  // TODO later: Recol
}

export function handleMinterRemoved(event: MinterRemoved): void {
  // TODO later: Recol
}

export function handleTransfer(event: Transfer): void {
  handleTokenTransfer(event as ERC20Transfer)
}
