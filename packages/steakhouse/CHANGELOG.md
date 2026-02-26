# @whisk/steakhouse

## 0.3.4

### Patch Changes

- 38c4811: Final changes for vault listing

## 0.3.3

### Patch Changes

- 45bebb6: Add new AUSD vaults

## 0.3.2

### Patch Changes

- 75a2405: Tweaked listings and changed some descriptions

## 0.3.1

### Patch Changes

- 2b2cdbb: Updated steakhouse vault whitelist

## 0.3.0

### Minor Changes

- a9ef2e1: Features:

  - Added getStats function including uniqueDeposits and tvl

  Breaking Changes:

  - `getTvl` replaced by `getStats`

  ```diff
  - const tvl = await getTvl(client)
  + const stats = await getStats(client)
  + const tvl = stats.tvl.current
  ```

  - `getTvlHistorical` replaced by `getStats`

  ```diff
  - const snapshots = await getTvlHistorical(client)
  + const stats = await getStats(client, { includeHistorical: true })
  + const snapshots = stats.tvl.historical;
  ```

### Patch Changes

- Updated dependencies [a9ef2e1]
  - @whisk/graphql@0.0.17
  - @whisk/client@0.0.17

## 0.2.2

### Patch Changes

- Updated dependencies [b6e7dae]
  - @whisk/graphql@0.0.16
  - @whisk/client@0.0.16

## 0.2.1

### Patch Changes

- f1d6bb3: fix isListed for one vault

## 0.2.0

### Minor Changes

- 2ceecb9: Features:

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

### Patch Changes

- Updated dependencies [2ceecb9]
  - @whisk/graphql@0.0.15
  - @whisk/client@0.0.15

## 0.1.1

### Patch Changes

- 33aec4e: Added `getChainAddresses` for steakhouse specific factory addresses.

## 0.1.0

### Minor Changes

- be73782: Restructure TVL queries around snapshot model and add historical TVL

  **Breaking changes:**

  - **`getTvl` return type changed**: Now returns `SteakhouseTvlSnapshot` instead of `SteakhouseTvl`. The shape is similar but includes `timestamp`
    instead of `computedAt`.
  - **`useTvl` hook removed**: Use `getTvl` directly with server-side fetching instead.
  - **`category` is now nullable in `byAssetCategory`**: `TokenCategory | null` instead of `TokenCategory`. A `null` category represents uncategorized
    assets.
  - **`tvlQuery` is no longer exported**: The GraphQL document is now a private module detail.

  **New features:**

  - **`getTvlHistorical`**: Fetch daily TVL snapshots for the last 365 days, ordered oldest-first.

### Patch Changes

- Updated dependencies [be73782]
  - @whisk/graphql@0.0.14
  - @whisk/client@0.0.14

## 0.0.10

### Patch Changes

- Updated dependencies [a631fb8]
  - @whisk/graphql@0.0.13
  - @whisk/client@0.0.13

## 0.0.9

### Patch Changes

- 25294c0: Add comprehensive vault metadata system - Add 22 missing vaults from Morpho (Polygon, Monad, Base, Ethereum, Arbitrum) - Create polygon chain support (chainId 137) - Generate VAULTS.md summary with chain and asset breakdowns - Total: 92 vaults across 7 chains The vault list serves as the source of truth for SDK consumers, enabling apps to query the API for specific trusted vault addresses.
- Updated dependencies [25294c0]
  - @whisk/graphql@0.0.12
  - @whisk/client@0.0.12

## 0.0.8

### Patch Changes

- 165522a: Add chain icon to getTvl.byChain query

## 0.0.7

### Patch Changes

- 157bda9: Added getTvl and useTvl
- Updated dependencies [157bda9]
  - @whisk/graphql@0.0.11
  - @whisk/client@0.0.11

## 0.0.6

### Patch Changes

- 82b040a: Added md based metadata config and generation

## 0.0.5

### Patch Changes

- 8772317: Add core functionality, minized other complexity, steakhouse SDK wip
- Updated dependencies [8772317]
  - @whisk/graphql@0.0.10
  - @whisk/client@0.0.10

## 0.0.4

### Patch Changes

- fc7ef3d: Add repository to package.json
- Updated dependencies [fc7ef3d]
  - @whisk/graphql@0.0.9
  - @whisk/client@0.0.9

## 0.0.3

### Patch Changes

- c6a10ed: Hardened security
- Updated dependencies [c6a10ed]
  - @whisk/graphql@0.0.8
  - @whisk/client@0.0.8

## 0.0.2

### Patch Changes

- 8336e73: Added @whisk/steakhouse scaffolding with subpath exports. Removed @whisk/react for now.
- Updated dependencies [8336e73]
  - @whisk/graphql@0.0.7
  - @whisk/client@0.0.7
