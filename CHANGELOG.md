# Changelog

## Next

Features:

- Added support for Merkle drops (for distributing rewards)

Schema changes:

- New entities:

```graphql
type MerkleDropClaim {}
type MerkleDropTranche {}
type MerkleDrop {}
```

Miscellaneous:

- Updated `graph-cli` and `graph-ts` to latest versions

## Version 1.2.0

Features:

- Added support for mStable EARN

Schema changes:

- New entities:

```graphql
type RewardsDistributor {}
type StakingBalance {}
type StakingReward {}
type StakingRewardsContract {}
type StakingRewardsContractClaimRewardTransaction {}
type StakingRewardsContractStakeTransaction {}
type StakingRewardsContractWithdrawTransaction {}
```

- Updated transaction type enum:

```
  // Renamed:
  MINT => MASSET_MINT
  SWAP => MASSET_SWAP
  REDEEM => MASSET_REDEEM
  EXIT => MASSET_REDEEM_MASSET
  PAIDFEE => MASSET_PAID_FEE
  SAVE => SAVINGS_CONTRACT_DEPOSIT
  WITHDRAW => SAVINGS_CONTRACT_WITHDRAW

  // New:
  STAKING_REWARDS_CONTRACT_CLAIM_REWARD
  STAKING_REWARDS_CONTRACT_EXIT
  STAKING_REWARDS_CONTRACT_STAKE
  STAKING_REWARDS_CONTRACT_WITHDRAW
```

## Version 1.1.0

_Released 25.06.20 12.11 CEST_

Features:

- Metrics
  - Added support for metrics, with hourly and daily intervals
  - Aggregated values:
    - Total supply
    - Total savings
  - Volumes:
    - Mint
    - Deposit savings
    - Withdraw savings
    - Swap
    - Redeem

## Version 1.0.0

_Released 27.05.20 16.43 CEST_

- Initial release, with support for all mUSD-related data
