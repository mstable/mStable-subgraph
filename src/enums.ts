export enum TransactionType {
  MINT,
  SWAP,
  REDEEM,
  EXIT,
  PAIDFEE,
  SAVE,
  WITHDRAW,
}

export enum TimeMetricPeriod {
  HOUR,
  DAY,
  WEEK,
  MONTH,
  QUARTER,
  YEAR,
}

export enum AggregateMetricType {
  TOTAL_SUPPLY,
  TOTAL_SAVINGS,
}

export function mapTimeMetricPeriod(period: TimeMetricPeriod): string {
  switch (period) {
    case TimeMetricPeriod.DAY:
      return 'DAY'
    case TimeMetricPeriod.HOUR:
      return 'HOUR'
    case TimeMetricPeriod.WEEK:
      return 'WEEK'
    case TimeMetricPeriod.MONTH:
      return 'MONTH'
    case TimeMetricPeriod.QUARTER:
      return 'QUARTER'
    case TimeMetricPeriod.YEAR:
      return 'YEAR'
    default:
      return ''
  }
}

export function mapTransactionType(type: TransactionType): string {
  switch (type) {
    case TransactionType.MINT:
      return 'MINT'
    case TransactionType.SWAP:
      return 'SWAP'
    case TransactionType.REDEEM:
      return 'REDEEM'
    case TransactionType.EXIT:
      return 'EXIT'
    case TransactionType.PAIDFEE:
      return 'PAIDFEE'
    case TransactionType.SAVE:
      return 'SAVE'
    case TransactionType.WITHDRAW:
      return 'WITHDRAW'
    default:
      return ''
  }
}

export function mapAggregateMetricType(type: AggregateMetricType): string {
  switch (type) {
    case AggregateMetricType.TOTAL_SAVINGS:
      return 'TOTAL_SAVINGS';
    case AggregateMetricType.TOTAL_SUPPLY:
      return 'TOTAL_SUPPLY';
    default:
      return ''
  }
}
