import { graphql, type ResultOf } from "@whisk/graphql"
import type { VariablesOf } from "gql.tada"
import type { SteakhouseClient } from "../client.js"
import { vaultFragment } from "./fragments/vault.js"

export const vaultQuery = graphql(
  `
    query GetVaults($limit: Int!) {
      morphoVaults(limit: $limit) {
        items {
          ...VaultFragment
        }
      }
    }
  `,
  [vaultFragment],
)

export type GetVaultsVariables = VariablesOf<typeof vaultQuery>
export type GetVaultsResult = ResultOf<typeof vaultQuery>["morphoVaults"]["items"]

export async function getVaults(
  client: SteakhouseClient,
  variables: GetVaultsVariables,
): Promise<GetVaultsResult> {
  const result = await client.query(vaultQuery, variables)
  return result.morphoVaults.items
}
