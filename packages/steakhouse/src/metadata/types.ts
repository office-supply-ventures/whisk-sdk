export type Address = `0x${string}`

/** Protocol type matching Erc4626VaultProtocol enum */
export type VaultProtocol = "morpho_v1" | "morpho_v2" | "generic" | "box"

export type VaultTag = "featured" | "new" | "deprecated"

export interface VaultConfig {
  readonly chainId: number
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
