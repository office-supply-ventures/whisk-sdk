import { graphql } from "@whisk/graphql"
import type { SteakhouseClient } from "../client.js"
import type { Address } from "../metadata/types.js"
import { ALL_VAULTS } from "../metadata/vaults.js"
import { type VaultDetail, vaultDetailFragment } from "./fragments/vaultDetail.js"
import { buildSteakhouseMetadata, type SteakhouseMetadata } from "./steakhouseMetadata.js"

/** Historical data fragment for vault charts (works for both v1 and v2) */
const vaultHistoricalFragment = graphql(`
  fragment VaultHistoricalFragment on Erc4626Vault {
    ... on MorphoVault {
      historical {
        daily {
          bucketTimestamp
          totalSupplied {
            formatted
            usd
          }
          supplyApy7d {
            total
          }
        }
      }
    }
    ... on MorphoVaultV2 {
      historical {
        daily {
          bucketTimestamp
          totalSupplied {
            formatted
            usd
          }
          supplyApy7d {
            total
          }
        }
      }
    }
  }
`)

/** Historical data type extracted from the fragment */
type VaultHistoricalData = {
  daily: Array<{
    bucketTimestamp: number
    totalSupplied: { formatted: string; usd: number | null }
    supplyApy7d: { total: number }
  }>
}

/** Query for fetching a single vault without historical data */
export const vaultQuery = graphql(
  `
    query GetVault($where: Erc4626VaultFilter) {
      erc4626Vaults(where: $where, limit: 1) {
        items {
          ...VaultDetailFragment
        }
      }
    }
  `,
  [vaultDetailFragment],
)

/** Query for fetching a single vault with historical data */
export const vaultWithHistoricalQuery = graphql(
  `
    query GetVaultWithHistorical($where: Erc4626VaultFilter) {
      erc4626Vaults(where: $where, limit: 1) {
        items {
          ...VaultDetailFragment
          ...VaultHistoricalFragment
        }
      }
    }
  `,
  [vaultDetailFragment, vaultHistoricalFragment],
)

export type GetDetailedVaultVariables = {
  chainId: number
  address: Address
  /** Include historical data for charts (default: true) */
  historical?: boolean
}

/** Vault detail with Steakhouse metadata and optional historical data */
export type DetailedVault = VaultDetail & {
  historical?: VaultHistoricalData | null
  steakhouseMetadata: SteakhouseMetadata
}

export type GetDetailedVaultResult = DetailedVault | null

/**
 * Get full details for a single Steakhouse vault with optional historical data.
 * Returns null if the vault is not in the whitelist.
 */
export async function getDetailedVault(
  client: SteakhouseClient,
  variables: GetDetailedVaultVariables,
): Promise<GetDetailedVaultResult> {
  const { chainId, address, historical = true } = variables

  const vaultConfig = ALL_VAULTS.find(
    (v) =>
      v.chainId === chainId && v.address.toLowerCase() === address.toLowerCase() && !v.isHidden,
  )

  if (!vaultConfig) {
    return null
  }

  const where = {
    keys: [
      {
        chainId,
        vaultAddress: address,
        protocol: vaultConfig.protocol,
      },
    ],
  }
  const query = historical ? vaultWithHistoricalQuery : vaultQuery
  const result = await client.query(query, { where })
  const vault = result.erc4626Vaults.items[0]

  if (!vault) {
    return null
  }

  return { ...vault, steakhouseMetadata: buildSteakhouseMetadata(vaultConfig) }
}
