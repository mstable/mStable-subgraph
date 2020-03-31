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
  increaseSavingsContractTotalSavings,
  decreaseSavingsContractTotalCredits,
  decreaseSavingsContractTotalSavings,
} from '../models/SavingsContract'
import { toDecimal } from '../utils/number'

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
  exchangeRate.exchangeRate = toDecimal(event.params.newExchangeRate, 16)
  exchangeRate.timestamp = event.block.timestamp.toI32()
  exchangeRate.save()
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

  savingsContract = increaseSavingsContractTotalCredits(
    event.address,
    event.params.creditsIssued,
  )

  savingsContract = increaseSavingsContractTotalSavings(
    event.address,
    event.params.savingsDeposited,
  )

  savingsContract.save()
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

  savingsContract = decreaseSavingsContractTotalCredits(
    event.address,
    event.params.creditsRedeemed,
  )

  savingsContract = decreaseSavingsContractTotalSavings(
    event.address,
    event.params.savingsCredited,
  )

  savingsContract.save()
}
