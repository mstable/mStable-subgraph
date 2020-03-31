import {
  AutomaticInterestCollectionSwitched,
  ExchangeRateUpdated,
  SavingsDeposited,
  CreditsRedeemed,
} from '../../generated/templates/SavingsContract/SavingsContract'
import {
  ExchangeRate,
  SavingsContract,
  SavingsContract as SavingsContractEntity,
} from '../../generated/schema'
import { getEventId } from '../utils/strings'
import { decreaseCreditBalance, increaseCreditBalance } from '../models/CreditBalance'
import { getOrCreateAccount } from '../models/Account'
import { toDecimal } from '../utils/number'

export function handleAutomaticInterestCollectionSwitched(
  event: AutomaticInterestCollectionSwitched,
): void {
  let savingsContractEntity = SavingsContractEntity.load(event.address.toHexString())
  savingsContractEntity.automationEnabled = event.params.automationEnabled
  savingsContractEntity.save()
}

export function handleExchangeRateUpdated(event: ExchangeRateUpdated): void {
  let eventId = getEventId(event)
  let exchangeRate = new ExchangeRate(eventId) // fixme use model
  exchangeRate.savingsContract = event.address.toHexString()
  exchangeRate.exchangeRate = toDecimal(event.params.newExchangeRate, 16)
  exchangeRate.timestamp = event.block.timestamp.toI32()
  exchangeRate.save()
}

export function handleSavingsDeposited(event: SavingsDeposited): void {
  let account = getOrCreateAccount(event.params.saver)
  let savingsContractEntity = SavingsContract.load(
    event.address.toHexString(),
  ) as SavingsContract // fixme use model
  let creditBalance = increaseCreditBalance(
    account,
    savingsContractEntity,
    event.params.creditsIssued,
  )
  creditBalance.save()

  savingsContractEntity.totalCredits = savingsContractEntity.totalCredits.plus(
    toDecimal(event.params.creditsIssued, 18),
  )
  savingsContractEntity.totalSavings = savingsContractEntity.totalSavings.plus(
    toDecimal(event.params.savingsDeposited, 18),
  )
  savingsContractEntity.save()
}

export function handleCreditsRedeemed(event: CreditsRedeemed): void {
  let account = getOrCreateAccount(event.params.redeemer)
  let savingsContractEntity = SavingsContract.load(
    event.address.toHexString(),
  ) as SavingsContract // fixme use model
  let creditBalance = decreaseCreditBalance(
    account,
    savingsContractEntity,
    event.params.creditsRedeemed,
  )
  creditBalance.save()

  savingsContractEntity.totalCredits = savingsContractEntity.totalCredits.minus(
    toDecimal(event.params.creditsRedeemed, 18),
  )
  savingsContractEntity.totalSavings = savingsContractEntity.totalSavings.minus(
    toDecimal(event.params.savingsCredited, 18),
  )
  savingsContractEntity.save()
}
