import {
  AutomaticInterestCollectionSwitched,
  CreditsRedeemed,
  ExchangeRateUpdated,
  SavingsDeposited,
} from '../../generated/templates/SavingsContract/SavingsContract'
import { getEventId } from '../utils/strings'
import {
  decreaseCreditBalance,
  increaseCreditBalance,
} from '../models/CreditBalance'
import { getOrCreateAccount } from '../models/Account'
import { getOrCreateExchangeRate } from '../models/ExchangeRate'
import {
  decreaseSavingsContractTotalCredits,
  decreaseSavingsContractTotalSavings,
  getOrCreateSavingsContract,
  increaseSavingsContractTotalCredits,
  updateSavingsContractTotalSavings,
} from '../models/SavingsContract'
import { toDecimal } from '../utils/number'
import { MASSET_DECIMALS } from '../utils/token'
import { appendAggregateMetrics, appendVolumeMetrics } from '../models/Metric'
import { AggregateMetricType, TransactionType } from '../enums'

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
  exchangeRate.exchangeRate = toDecimal(
    event.params.newExchangeRate,
    MASSET_DECIMALS,
  )
  exchangeRate.timestamp = event.block.timestamp.toI32()
  exchangeRate.save()

  let totalSavings = updateSavingsContractTotalSavings(event.address)

  appendAggregateMetrics(
    AggregateMetricType.TOTAL_SAVINGS,
    totalSavings,
    event.block.timestamp,
  )
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

  let totalSavings = updateSavingsContractTotalSavings(event.address)

  appendVolumeMetrics(
    TransactionType.SAVINGS_CONTRACT_DEPOSIT,
    toDecimal(event.params.savingsDeposited, MASSET_DECIMALS),
    event.block.timestamp,
  )

  appendAggregateMetrics(
    AggregateMetricType.TOTAL_SAVINGS,
    totalSavings,
    event.block.timestamp,
  )
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

  decreaseSavingsContractTotalCredits(
    event.address,
    event.params.creditsRedeemed,
  )

  let totalSavings = decreaseSavingsContractTotalSavings(
    event.address,
    event.params.savingsCredited,
  )

  appendVolumeMetrics(
    TransactionType.SAVINGS_CONTRACT_WITHDRAW,
    toDecimal(event.params.savingsCredited, MASSET_DECIMALS),
    event.block.timestamp,
  )

  appendAggregateMetrics(
    AggregateMetricType.TOTAL_SAVINGS,
    totalSavings,
    event.block.timestamp,
  )
}
