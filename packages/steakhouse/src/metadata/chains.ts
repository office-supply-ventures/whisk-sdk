import type { ChainConfig } from "./types.js"

export const MAINNET: ChainConfig = {
  id: 1,
  name: "Ethereum Mainnet",
}

export const BASE: ChainConfig = {
  id: 8453,
  name: "Base",
}

export const SUPPORTED_CHAINS = [MAINNET, BASE] as const
