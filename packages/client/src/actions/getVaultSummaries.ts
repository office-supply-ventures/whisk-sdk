import { graphql, type ResultOf } from "@whisk/graphql"
import type { VariablesOf } from "gql.tada"
import type { WhiskActionFn } from "../types.js"
import { vaultSummaryFragment } from "./fragments/vault.js"

export const vaultSummaryQuery = graphql(
  `
    query ($limit: Int!) {
      morphoVaults(limit: $limit) {
        items {
          ...VaultSummaryFragment
        }
      }
    }
  `,
  [vaultSummaryFragment],
)

export type GetVaultSummariesVariables = VariablesOf<typeof vaultSummaryQuery>
export type GetVaultSummariesResult = ResultOf<typeof vaultSummaryQuery>["morphoVaults"]["items"]

export const getVaultSummaries: WhiskActionFn<
  GetVaultSummariesResult,
  GetVaultSummariesVariables
> = async (client, variables) => {
  const result = await client.query(vaultSummaryQuery, variables)
  return result.morphoVaults.items
}
