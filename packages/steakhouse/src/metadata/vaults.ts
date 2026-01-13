import type { VaultConfig } from "./types.js"

// Mainnet vault configurations
export const MAINNET_VAULTS: readonly VaultConfig[] = [
  {
    chainId: 1,
    address: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
    protocol: "morpho_v1",
  },
  {
    chainId: 1,
    address: "0xbeef0046fcab1dE47E41fB75BB3dC4Dfc94108E3",
    protocol: "morpho_v2",
    tag: "featured",
  },
  {
    chainId: 1,
    address: "0xbeeff2C5bF38f90e3482a8b19F12E5a6D2FCa757",
    protocol: "morpho_v2",
  },
] as const

// Base vault configurations
export const BASE_VAULTS: readonly VaultConfig[] = [] as const

// All vaults across all chains
export const ALL_VAULTS = [...MAINNET_VAULTS, ...BASE_VAULTS] as const
