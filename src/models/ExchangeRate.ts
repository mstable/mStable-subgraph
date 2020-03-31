import { ExchangeRate } from '../../generated/schema'

export function getOrCreateExchangeRate(exchangeRateId: string): ExchangeRate {
  let exchangeRate = ExchangeRate.load(exchangeRateId)

  if (exchangeRate != null) {
    return exchangeRate as ExchangeRate
  }

  exchangeRate = new ExchangeRate(exchangeRateId)
  return exchangeRate as ExchangeRate
}
