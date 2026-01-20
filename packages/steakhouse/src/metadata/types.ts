import type { VaultProtocol } from "@whisk/graphql"

export type { VaultProtocol }
export type Address = `0x${string}`

/** Valid vault types for categorization */
export const VAULT_TYPES = ["Prime", "High Yield", "Turbo", "Term"] as const
export type VaultType = (typeof VAULT_TYPES)[number]

/** Vault configuration with metadata */
export interface VaultConfig {
  readonly chainId: number
  readonly address: Address
  readonly protocol: VaultProtocol
  readonly name?: string
  readonly description?: string
  readonly type?: VaultType
}
