# @whisk/graphql

## 0.0.16

### Patch Changes

- b6e7dae: Consumed latest schema changes

## 0.0.15

### Patch Changes

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

## 0.0.14

### Patch Changes

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

## 0.0.13

### Patch Changes

- a631fb8: Sync'd with Whisk Schema to pickup most recent changes

## 0.0.12

### Patch Changes

- 25294c0: Add comprehensive vault metadata system - Add 22 missing vaults from Morpho (Polygon, Monad, Base, Ethereum, Arbitrum) - Create polygon chain support (chainId 137) - Generate VAULTS.md summary with chain and asset breakdowns - Total: 92 vaults across 7 chains The vault list serves as the source of truth for SDK consumers, enabling apps to query the API for specific trusted vault addresses.

## 0.0.11

### Patch Changes

- 157bda9: Added getTvl and useTvl

## 0.0.10

### Patch Changes

- 8772317: Add core functionality, minized other complexity, steakhouse SDK wip

## 0.0.9

### Patch Changes

- fc7ef3d: Add repository to package.json

## 0.0.8

### Patch Changes

- c6a10ed: Hardened security

## 0.0.7

### Patch Changes

- 8336e73: Added @whisk/steakhouse scaffolding with subpath exports. Removed @whisk/react for now.

## 0.0.6

### Patch Changes

- d2af4d9: make graphql a peer dependecy

## 0.0.5

### Patch Changes

- f826dc8: Testing full deploy flow

## 0.0.4

### Patch Changes

- 6dfb615: Fix build setup

## 0.0.3

### Patch Changes

- b728c66: Fix export fields in package.json

## 0.0.2

### Patch Changes

- c1217ec: Scaffolding initial functionality for graphql, client, and react packages

## 0.0.1

### Patch Changes

- c76082e: Test github actions
