import type { VaultProtocol } from "@whisk/graphql"

export type { VaultProtocol }
export type Address = `0x${string}`

/** Valid vault strategies for categorization */
export const VAULT_STRATEGIES = ["Prime", "High Yield", "Turbo", "Term"] as const
export type VaultStrategy = (typeof VAULT_STRATEGIES)[number]

/** Vault configuration with metadata */
export interface VaultConfig {
  readonly chainId: number
  readonly address: Address
  readonly protocol: VaultProtocol
  readonly name?: string
  readonly description?: string
  readonly strategy?: VaultStrategy
  readonly isListed: boolean
}
