import { graphql, type ResultOf } from "@whisk/graphql"
import type { SteakhouseClient } from "../client.js"

/** GraphQL query for fetching Steakhouse TVL */
export const tvlQuery = graphql(`
  query GetSteakhouseTvl {
    steakhouseTvl {
      totalUsd
      computedAt
      byChain {
        chain {
          id
          name
          icon
        }
        tvlUsd
      }
      byProtocol {
        protocol
        tvlUsd
      }
      byAssetCategory {
        category
        tvlUsd
      }
    }
  }
`)

export type GetTvlResult = ResultOf<typeof tvlQuery>["steakhouseTvl"]

/**
 * Get Steakhouse TVL breakdown by chain, protocol, and asset category.
 */
export async function getTvl(client: SteakhouseClient): Promise<GetTvlResult> {
  const result = await client.query(tvlQuery, {})
  return result.steakhouseTvl
}
