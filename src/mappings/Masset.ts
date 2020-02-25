import {
  Approval,
  BasketWeightsUpdated,
  BassetAdded,
  BassetRemoved,
  FeeRecipientChanged,
  Minted,
  PaidFee,
  Redeemed,
  RedeemedSingle,
  RedemptionFeeChanged,
  Transfer,
} from '../../generated/Manager/Masset'
import { Transfer as ERC20Transfer } from '../../generated/MTA/ERC20Detailed'
import { getBassetToken, upsertBasket } from '../models/Basket'
import { getOrCreateAccount } from '../models/Account'
import { increaseAccountBalance } from '../models/AccountBalance'
import { updateMassetFeePool, updateMassetRedemptionFee } from '../models/Masset'
import { handleTokenTransfer } from './Token'

export function handleApproval(event: Approval): void {
  // TODO later (if useful): store token allowances
}

export function handleBassetAdded(event: BassetAdded): void {
  upsertBasket(event.address)
}

export function handleBassetRemoved(event: BassetRemoved): void {
  upsertBasket(event.address)
}

export function handleBasketWeightsUpdated(event: BasketWeightsUpdated): void {
  upsertBasket(event.address)
}

export function handleFeeRecipientChanged(event: FeeRecipientChanged): void {
  updateMassetFeePool(event.address, event.params.feePool)
}

export function handleMinted(event: Minted): void {
  upsertBasket(event.address)
}

export function handleMintedSingle(event: Minted): void {
  // 1. Basset is transferred from sender to Masset -> handled by transfer event handler
  // 2. Basset vault balance is increased -> handled here
  // 3. Masset is minted -> handled by transfer event handler
  // 4. Masset is transferred to sender -> handled by transfer event handler
  upsertBasket(event.address)
}

export function handlePaidFee(event: PaidFee): void {
  // Handled by the MTA transfer event handler
}

export function handleRedeemed(event: Redeemed): void {
  upsertBasket(event.address)
}

export function handleRedeemedSingle(event: RedeemedSingle): void {
  // 1. vaultBalance of basset is reduced -> handled here
  // 2. Sender pays redemption fee -> tracked by the MTA token event handler
  // 3. Masset is burned -> tracked by the Masset token transfer event handler
  // 4. Basset is transferred to receipient -> handled here
  let token = getBassetToken(event.address, event.params.index)
  increaseAccountBalance(
    getOrCreateAccount(event.params.recipient),
    token,
    event.params.bAssetQuantity,
  )
}

export function handleRedemptionFeeChanged(event: RedemptionFeeChanged): void {
  updateMassetRedemptionFee(event.address, event.params.fee)
}

export function handleTransfer(event: Transfer): void {
  handleTokenTransfer(event as ERC20Transfer)
}
