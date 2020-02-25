import {
  RewardClaimed,
  RewardeePointsIncreased,
  RewardRedeemed,
  TotalPointsIncreased,
  TrancheFunded,
  UnclaimedRewardWithdrawn,
} from '../../generated/ForgeRewardsMUSD/ForgeRewardsMUSD'
import { updateTranche } from '../models/Tranche'

export function handleRewardeePointsIncreased(
  event: RewardeePointsIncreased,
): void {
  updateTranche(event.address, event.params.trancheNumber)
}

export function handleTotalPointsIncreased(event: TotalPointsIncreased): void {
  updateTranche(event.address, event.params.trancheNumber)
}

export function handleRewardClaimed(event: RewardClaimed): void {
  updateTranche(event.address, event.params.trancheNumber)
}

export function handleRewardRedeemed(event: RewardRedeemed): void {
  updateTranche(event.address, event.params.trancheNumber)
}

export function handleTrancheFunded(event: TrancheFunded): void {
  updateTranche(event.address, event.params.trancheNumber)
}

export function handleUnclaimedRewardWithdrawn(event: UnclaimedRewardWithdrawn): void {
  updateTranche(event.address, event.params.trancheNumber)
}
