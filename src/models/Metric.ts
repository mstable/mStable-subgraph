import { BigDecimal, BigInt } from '@graphprotocol/graph-ts'
import { AggregateMetric, VolumeMetric } from '../../generated/schema'
import {
  mapTransactionType,
  mapTimeMetricPeriod,
  TransactionType,
  TimeMetricPeriod,
  AggregateMetricType,
  mapAggregateMetricType,
} from '../enums'
import { MASSET_DECIMALS } from '../utils/token'
import { toDecimal } from '../utils/number'

export function roundDownToHour(timestamp: BigInt): BigInt {
  let hour: BigInt = BigInt.fromI32(60 * 60)
  return timestamp.minus(timestamp.mod(hour))
}

export function roundDownToDay(timestamp: BigInt): BigInt {
  let day: BigInt = BigInt.fromI32(24 * 60 * 60)
  return timestamp.minus(timestamp.mod(day))
}

function getVolumeMetricId(
  type: TransactionType,
  period: TimeMetricPeriod,
  timestamp: BigInt,
): string {
  let mappedPeriod = mapTimeMetricPeriod(period)
  let mappedType = mapTransactionType(type)

  return mappedPeriod + '-' + mappedType + '-' + timestamp.toString()
}

function getOrCreateVolumeMetricHour(
  type: TransactionType,
  timestamp: BigInt,
): VolumeMetric {
  let hourTimestamp = roundDownToHour(timestamp)
  let id = getVolumeMetricId(type, TimeMetricPeriod.HOUR, hourTimestamp)
  let metric = VolumeMetric.load(id)

  if (metric != null) {
    return metric as VolumeMetric
  }

  metric = new VolumeMetric(id)
  metric.period = mapTimeMetricPeriod(TimeMetricPeriod.HOUR)
  metric.timestamp = hourTimestamp.toI32()
  metric.type = mapTransactionType(type)
  metric.value = toDecimal(BigInt.fromI32(0), MASSET_DECIMALS)
  metric.save()
  return metric as VolumeMetric
}

function getOrCreateVolumeMetricDay(
  type: TransactionType,
  timestamp: BigInt,
): VolumeMetric {
  let dayTimestamp = roundDownToDay(timestamp)
  let id = getVolumeMetricId(type, TimeMetricPeriod.DAY, dayTimestamp)
  let metric = VolumeMetric.load(id)

  if (metric != null) {
    return metric as VolumeMetric
  }

  metric = new VolumeMetric(id)
  metric.period = mapTimeMetricPeriod(TimeMetricPeriod.DAY)
  metric.timestamp = dayTimestamp.toI32()
  metric.type = mapTransactionType(type)
  metric.value = toDecimal(BigInt.fromI32(0), MASSET_DECIMALS)
  metric.save()
  return metric as VolumeMetric
}

export function appendVolumeMetrics(
  type: TransactionType,
  value: BigDecimal,
  timestamp: BigInt,
): void {
  let hourLog = getOrCreateVolumeMetricHour(type, timestamp)
  hourLog.value = hourLog.value.plus(value)
  hourLog.save()

  let dayLog = getOrCreateVolumeMetricDay(type, timestamp)
  dayLog.value = dayLog.value.plus(value)
  dayLog.save()
}

function getAggregateMetricId(
  type: AggregateMetricType,
  period: TimeMetricPeriod,
  timestamp: BigInt,
): string {
  let mappedPeriod = mapTimeMetricPeriod(period)
  let mappedType = mapAggregateMetricType(type)

  return mappedPeriod + '-' + mappedType + '-' + timestamp.toString()
}

function getOrCreateAggregateMetricHour(
  type: AggregateMetricType,
  timestamp: BigInt,
): AggregateMetric {
  let hourTimestamp = roundDownToHour(timestamp)
  let id = getAggregateMetricId(type, TimeMetricPeriod.HOUR, hourTimestamp)
  let metric = AggregateMetric.load(id)

  if (metric != null) {
    return metric as AggregateMetric
  }

  metric = new AggregateMetric(id)
  metric.period = mapTimeMetricPeriod(TimeMetricPeriod.HOUR)
  metric.timestamp = hourTimestamp.toI32()
  metric.type = mapAggregateMetricType(type)
  metric.value = toDecimal(BigInt.fromI32(0), MASSET_DECIMALS)
  metric.save()
  return metric as AggregateMetric
}

function getOrCreateAggregateMetricDay(
  type: AggregateMetricType,
  timestamp: BigInt,
): AggregateMetric {
  let dayTimestamp = roundDownToDay(timestamp)
  let id = getAggregateMetricId(type, TimeMetricPeriod.DAY, dayTimestamp)
  let metric = AggregateMetric.load(id)

  if (metric != null) {
    return metric as AggregateMetric
  }

  metric = new AggregateMetric(id)
  metric.period = mapTimeMetricPeriod(TimeMetricPeriod.DAY)
  metric.timestamp = dayTimestamp.toI32()
  metric.type = mapAggregateMetricType(type)
  metric.value = toDecimal(BigInt.fromI32(0), MASSET_DECIMALS)
  metric.save()
  return metric as AggregateMetric
}

export function appendAggregateMetrics(
  type: AggregateMetricType,
  value: BigDecimal,
  timestamp: BigInt,
): void {
  let hourLog = getOrCreateAggregateMetricHour(type, timestamp)
  hourLog.value = value
  hourLog.save()

  let dayLog = getOrCreateAggregateMetricDay(type, timestamp)
  dayLog.value = value
  dayLog.save()
}
