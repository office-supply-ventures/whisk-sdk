# @whisk/steakhouse

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
