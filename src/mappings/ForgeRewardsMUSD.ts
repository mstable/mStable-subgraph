import {
  RewardeeMintVolumeIncreased,
  MintVolumeIncreased,
  RewardClaimed,
  RewardRedeemed,
  TrancheFunded,
  UnclaimedRewardWithdrawn,
} from '../../generated/ForgeRewardsMUSD/ForgeRewardsMUSD'
import { updateTranche } from '../models/Tranche'

export function handleRewardeeMintVolumeIncreased(
  event: RewardeeMintVolumeIncreased,
): void {
  updateTranche(event.address, event.params.trancheNumber)
}

export function handleMintVolumeIncreased(event: MintVolumeIncreased): void {
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
