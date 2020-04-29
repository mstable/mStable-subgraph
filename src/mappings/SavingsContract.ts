import {
  AutomaticInterestCollectionSwitched,
  ExchangeRateUpdated,
  SavingsDeposited,
  CreditsRedeemed,
} from '../../generated/templates/SavingsContract/SavingsContract'
import { getEventId } from '../utils/strings'
import { decreaseCreditBalance, increaseCreditBalance } from '../models/CreditBalance'
import { getOrCreateAccount } from '../models/Account'
import { getOrCreateExchangeRate } from '../models/ExchangeRate'
import {
  getOrCreateSavingsContract,
  increaseSavingsContractTotalCredits,
  updateSavingsContractTotalSavings,
  decreaseSavingsContractTotalCredits,
  decreaseSavingsContractTotalSavings,
} from '../models/SavingsContract'
import { toDecimal } from '../utils/number'
import { DEFAULT_DECIMALS } from '../utils/token'

export function handleAutomaticInterestCollectionSwitched(
  event: AutomaticInterestCollectionSwitched,
): void {
  let savingsContract = getOrCreateSavingsContract(event.address)
  savingsContract.automationEnabled = event.params.automationEnabled
  savingsContract.save()
}

export function handleExchangeRateUpdated(event: ExchangeRateUpdated): void {
  let eventId = getEventId(event)
  let exchangeRate = getOrCreateExchangeRate(eventId)
  exchangeRate.savingsContract = event.address.toHexString()
  exchangeRate.exchangeRate = toDecimal(event.params.newExchangeRate, DEFAULT_DECIMALS)
  exchangeRate.timestamp = event.block.timestamp.toI32()
  exchangeRate.save()

  updateSavingsContractTotalSavings(event.address)
}

export function handleSavingsDeposited(event: SavingsDeposited): void {
  let account = getOrCreateAccount(event.params.saver)
  let savingsContract = getOrCreateSavingsContract(event.address)

  let creditBalance = increaseCreditBalance(
    account,
    savingsContract,
    event.params.creditsIssued,
  )
  creditBalance.save()

  increaseSavingsContractTotalCredits(event.address, event.params.creditsIssued)

  updateSavingsContractTotalSavings(event.address)
}

export function handleCreditsRedeemed(event: CreditsRedeemed): void {
  let account = getOrCreateAccount(event.params.redeemer)
  let savingsContract = getOrCreateSavingsContract(event.address)

  let creditBalance = decreaseCreditBalance(
    account,
    savingsContract,
    event.params.creditsRedeemed,
  )
  creditBalance.save()

  decreaseSavingsContractTotalCredits(event.address, event.params.creditsRedeemed)

  decreaseSavingsContractTotalSavings(event.address, event.params.savingsCredited)
}
