import type { VaultConfig } from "./types.js"

// Mainnet vault configurations
// TODO: Add real Steakhouse vault addresses
export const MAINNET_VAULTS: readonly VaultConfig[] = [
  // Example placeholder vault
  // {
  //   address: "0x...",
  //   protocol: "steakhouse",
  //   name: "Steakhouse USDC Vault",
  //   tag: "featured",
  // },
] as const

// Base vault configurations
// TODO: Add real Steakhouse vault addresses
export const BASE_VAULTS: readonly VaultConfig[] = [
  // Example placeholder vault
  // {
  //   address: "0x...",
  //   protocol: "steakhouse",
  //   name: "Steakhouse USDC Vault",
  // },
] as const

// All vaults across all chains
export const ALL_VAULTS = [...MAINNET_VAULTS, ...BASE_VAULTS] as const
