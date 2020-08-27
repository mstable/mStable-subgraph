import { BigInt } from '@graphprotocol/graph-ts'
import {
  Basset,
  FeePaidTransaction,
  StakingRewardsContractClaimRewardTransaction,
  StakingRewardsContractStakeTransaction,
  StakingRewardsContractWithdrawTransaction,
  SwapTransaction,
} from './../../generated/schema'
import {
  RewardPaid,
  Staked,
  Withdrawn,
} from '../../generated/templates/StakingRewards/StakingRewards'
import { PaidFee, Swapped } from './../../generated/MUSD/Masset'
import { RATIO, toDecimal } from '../utils/number'
import { mapTransactionType, TransactionType } from '../enums'

export function getOrCreateSwapTransaction(event: Swapped): SwapTransaction {
  let txHash = event.transaction.hash
  let type = mapTransactionType(TransactionType.MASSET_SWAP)
  let id = txHash.toHexString().concat(type)
  let transaction = SwapTransaction.load(id)

  if (transaction != null) {
    return transaction as SwapTransaction
  }

  transaction = new SwapTransaction(id)
  transaction.tx = txHash
  transaction.type = type
  transaction.mAsset = event.address.toHex()
  let outputBasset = Basset.load(event.params.output.toHexString())
  let ratioedOutputAmount = event.params.outputAmount
    .times(outputBasset.ratio)
    .div(RATIO)
  transaction.mAssetUnits = toDecimal(ratioedOutputAmount, 18)
  transaction.timestamp = event.block.timestamp.toI32()
  transaction.sender = event.params.swapper
  transaction.inputBasset = event.params.input.toHexString()
  transaction.outputBasset = event.params.output.toHexString()
  transaction.recipient = event.params.recipient
  transaction.save()
  return transaction as SwapTransaction
}

export function getOrCreateFeePaidTransaction(
  event: PaidFee,
): FeePaidTransaction {
  let txHash = event.transaction.hash
  let type = mapTransactionType(TransactionType.MASSET_PAID_FEE)
  let id = txHash.toHexString().concat(type)
  let transaction = FeePaidTransaction.load(id)

  if (transaction != null) {
    return transaction as FeePaidTransaction
  }

  transaction = new FeePaidTransaction(id)
  transaction.tx = txHash
  transaction.type = type
  transaction.mAsset = event.address.toHex()
  let paidInBasset = Basset.load(event.params.asset.toHexString())
  let ratioedOutputAmount = BigInt.fromI32(
    (<i32>event.params.feeQuantity) as i32,
  )
    .times(paidInBasset.ratio)
    .div(RATIO)
  transaction.mAssetUnits = toDecimal(ratioedOutputAmount, 18)
  transaction.timestamp = event.block.timestamp.toI32()
  transaction.sender = event.params.payer
  transaction.asset = event.params.asset.toHexString()
  transaction.save()
  return transaction as FeePaidTransaction
}

export function getOrCreateStakingRewardsContractWithdrawTransaction(
  event: Withdrawn,
): StakingRewardsContractWithdrawTransaction {
  let txHash = event.transaction.hash
  let type = mapTransactionType(
    TransactionType.STAKING_REWARDS_CONTRACT_WITHDRAW,
  )
  let id = txHash.toHexString().concat(type)

  {
    let transaction = StakingRewardsContractWithdrawTransaction.load(id)
    if (transaction != null) {
      return transaction as StakingRewardsContractWithdrawTransaction
    }
  }

  let transaction = new StakingRewardsContractWithdrawTransaction(id)

  transaction.tx = txHash
  transaction.sender = event.params.user
  transaction.timestamp = event.block.timestamp.toI32()
  transaction.type = type
  transaction.amount = event.params.amount
  transaction.stakingRewardsContract = event.address.toHexString()
  transaction.save()

  return transaction
}

export function getOrCreateStakingRewardsContractRewardPaidTransaction(
  event: RewardPaid,
): StakingRewardsContractClaimRewardTransaction {
  let txHash = event.transaction.hash
  let type = mapTransactionType(
    TransactionType.STAKING_REWARDS_CONTRACT_CLAIM_REWARD,
  )
  let id = txHash.toHexString().concat(type)

  {
    let transaction = StakingRewardsContractClaimRewardTransaction.load(id)
    if (transaction != null) {
      return transaction as StakingRewardsContractClaimRewardTransaction
    }
  }

  let transaction = new StakingRewardsContractClaimRewardTransaction(id)

  transaction.tx = txHash
  transaction.sender = event.params.user
  transaction.timestamp = event.block.timestamp.toI32()
  transaction.type = type
  transaction.amount = event.params.reward
  transaction.stakingRewardsContract = event.address.toHexString()
  transaction.save()

  return transaction
}

export function getOrCreateStakingRewardsContractStakeTransaction(
  event: Staked,
): StakingRewardsContractStakeTransaction {
  let txHash = event.transaction.hash
  let type = mapTransactionType(TransactionType.STAKING_REWARDS_CONTRACT_STAKE)
  let id = txHash.toHexString().concat(type)

  {
    let transaction = StakingRewardsContractStakeTransaction.load(id)
    if (transaction != null) {
      return transaction as StakingRewardsContractStakeTransaction
    }
  }

  let transaction = new StakingRewardsContractStakeTransaction(id)

  transaction.tx = txHash
  transaction.sender = event.params.user
  transaction.timestamp = event.block.timestamp.toI32()
  transaction.type = type
  transaction.amount = event.params.amount
  transaction.stakingRewardsContract = event.address.toHexString()
  transaction.save()

  return transaction
}
