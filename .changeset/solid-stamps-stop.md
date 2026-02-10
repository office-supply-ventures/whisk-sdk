---
"@whisk/steakhouse": minor
"@whisk/graphql": patch
---

Features:
- Renamed `getChainAddresses` to `getChainDeployments` and `ChainAddresses` to `ChainDeployments`
- Updated steakhouse vault metadata

Breaking change migration:
  ```diff
  - import { getChainAddresses, type ChainAddresses } from "@whisk/steakhouse/metadata"
  + import { getChainDeployments, type ChainDeployments } from "@whisk/steakhouse/metadata"

  - const addresses = getChainAddresses(chainId)
  + const deployments = getChainDeployments(chainId)
  ```
- `getChainDeployments` now returns per-chain `vaults` alongside singleton contract addresses, making it a single entry point for all chain-specific deployment info
- Added vaults to match the Steakhouse app: `usdc-turbo` and `xaut0-turbo` (Arbitrum), `eth-prime-instant-v2` and `usdc-prime-instant-v2-a` (Base), `eurcv-prime-deblock` (Mainnet), and additional vaults across Monad and Polygon

