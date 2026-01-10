export type Address = `0x${string}`

export type VaultProtocol = "morpho" | "steakhouse"

export type VaultTag = "featured" | "new" | "deprecated"

export interface VaultConfig {
  readonly address: Address
  readonly protocol: VaultProtocol
  readonly name?: string
  readonly description?: string
  readonly tag?: VaultTag
  readonly isHidden?: boolean
}

export interface ChainConfig {
  readonly id: number
  readonly name: string
}
