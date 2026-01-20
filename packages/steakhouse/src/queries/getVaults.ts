import { graphql } from "@whisk/graphql"
import type { SteakhouseClient } from "../client.js"
import { STEAKHOUSE_VAULTS } from "../metadata/generated/vaults.js"
import type { Address, VaultConfig } from "../metadata/types.js"
import { type VaultDetail, vaultDetailFragment } from "./fragments/vaultDetail.js"
import { buildSteakhouseMetadata, type SteakhouseMetadata } from "./steakhouseMetadata.js"

/** GraphQL query for fetching Steakhouse vaults */
export const vaultsQuery = graphql(
  `
    query GetVaults($where: Erc4626VaultFilter, $limit: Int) {
      erc4626Vaults(where: $where, limit: $limit) {
        items {
          ...VaultDetailFragment
        }
      }
    }
  `,
  [vaultDetailFragment],
)

export type GetVaultsVariables = {
  /** Filter by chain ID */
  chainId?: number
}

/** Vault with Steakhouse metadata */
export type VaultWithMetadata = VaultDetail & {
  steakhouseMetadata?: SteakhouseMetadata
}

export type GetVaultsResult = VaultWithMetadata[]

/**
 * Get all Steakhouse-curated vaults.
 * Results are filtered to the SDK whitelist and augmented with Steakhouse metadata.
 */
export async function getVaults(
  client: SteakhouseClient,
  variables: GetVaultsVariables = {},
): Promise<GetVaultsResult> {
  const { chainId } = variables

  const filteredVaults = chainId
    ? STEAKHOUSE_VAULTS.filter((v) => v.chainId === chainId)
    : STEAKHOUSE_VAULTS

  if (filteredVaults.length === 0) {
    return []
  }

  // Build keys array for erc4626Vaults filter
  const keys = filteredVaults.map((v) => ({
    chainId: v.chainId,
    vaultAddress: v.address,
    protocol: v.protocol,
  }))

  const result = await client.query(vaultsQuery, {
    where: { keys },
    limit: keys.length,
  })

  const metadataMap = new Map<Address, VaultConfig>(
    filteredVaults.map((v) => [v.address.toLowerCase() as Address, v]),
  )

  return result.erc4626Vaults.items
    .filter((vault): vault is NonNullable<typeof vault> => vault !== null)
    .map((vault) => {
      const config = metadataMap.get(vault.vaultAddress.toLowerCase() as Address)
      if (config) {
        return { ...vault, steakhouseMetadata: buildSteakhouseMetadata(config) }
      }
      return vault
    })
}
