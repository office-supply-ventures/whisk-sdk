import type { VaultConfig } from "../metadata/types.js"

/** Steakhouse-specific metadata augmented onto vault data */
export type SteakhouseMetadata = {
  name?: string
  description?: string
  tag?: VaultConfig["tag"]
  protocol: VaultConfig["protocol"]
}

/** Build metadata object from vault config */
export function buildSteakhouseMetadata(config: VaultConfig): SteakhouseMetadata {
  return {
    protocol: config.protocol,
    ...(config.name !== undefined && { name: config.name }),
    ...(config.description !== undefined && { description: config.description }),
    ...(config.tag !== undefined && { tag: config.tag }),
  }
}
