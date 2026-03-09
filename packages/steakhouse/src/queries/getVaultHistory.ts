import { type FragmentOf, graphql } from "@whisk/graphql"
import type { SteakhouseClient } from "../client.js"
import {
  morphoVaultHistoricalEntryFragment,
  resolveVaultConfig,
  type VaultKeyVariables,
} from "./fragments.js"

const vaultHistoricalQuery = graphql(
  `
  query GetSteakhouseVaultHistory($keys: [Erc4626VaultKey!]!) {
    erc4626Vaults(where: { keys: $keys }) {
      items {
        address
        historical {
          ... on MorphoVaultHistorical {
            daily {
              ...MorphoVaultHistoricalEntryFields
            }
            weekly {
              ...MorphoVaultHistoricalEntryFields
            }
          }
        }
      }
    }
  }
`,
  [morphoVaultHistoricalEntryFragment],
)

type HistoricalEntry = FragmentOf<typeof morphoVaultHistoricalEntryFragment>

export interface SteakhouseVaultHistory {
  daily: ReadonlyArray<HistoricalEntry> | null
  weekly: ReadonlyArray<HistoricalEntry> | null
}

export type GetVaultHistoryVariables = VaultKeyVariables

export async function getVaultHistory(
  client: SteakhouseClient,
  variables: GetVaultHistoryVariables,
): Promise<SteakhouseVaultHistory> {
  const config = resolveVaultConfig(variables)

  if (!config) {
    return { daily: null, weekly: null }
  }

  const result = await client.query(vaultHistoricalQuery, {
    keys: [
      {
        chainId: config.chainId,
        vaultAddress: config.address,
        protocol: config.protocol,
      },
    ],
  })

  const item = result.erc4626Vaults.items[0]
  if (!item?.historical) {
    return { daily: null, weekly: null }
  }

  const historical = item.historical

  return {
    daily: "daily" in historical ? (historical.daily ?? null) : null,
    weekly: "weekly" in historical ? (historical.weekly ?? null) : null,
  }
}
