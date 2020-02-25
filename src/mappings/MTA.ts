import { Transfer, Approval, ClaimedTokens, NewCloneToken } from '../../generated/MTA/Systok'
import { Transfer as ERC20Transfer } from '../../generated/MTA/ERC20Detailed'
import { handleTokenTransfer } from './Token'

export function handleApproval(event: Approval): void {
  // TODO later
}

export function handleClaimedTokens(event: ClaimedTokens): void {
  // TODO later
}

export function handleNewCloneToken(event: NewCloneToken): void {
  // TODO later
}

export function handleTransfer(event: Transfer): void {
  handleTokenTransfer(event as ERC20Transfer)
}
