import type { Erc4626VaultProtocol } from "@whisk/graphql"

export type Address = `0x${string}`

/** Valid vault strategies for categorization */
export const VAULT_STRATEGIES = ["Prime", "High Yield", "Turbo", "Term"] as const
export type VaultStrategy = (typeof VAULT_STRATEGIES)[number]

/** Vault configuration with metadata */
export interface VaultConfig {
  readonly chainId: number
  readonly address: Address
  readonly protocol: Erc4626VaultProtocol
  readonly name?: string
  readonly description?: string
  readonly strategy?: VaultStrategy
  readonly isListed: boolean
}
