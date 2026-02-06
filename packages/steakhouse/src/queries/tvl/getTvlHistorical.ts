import { graphql, type ResultOf } from "@whisk/graphql"
import type { SteakhouseClient } from "../../client.js"
import { tvlSnapshotFragment } from "./fragments.js"

/** GraphQL query for fetching historical Steakhouse TVL */
const tvlHistoricalQuery = graphql(
  `
    query GetSteakhouseTvlHistorical {
      steakhouseTvl {
        historical {
          ...TvlSnapshot
        }
      }
    }
  `,
  [tvlSnapshotFragment],
)

export type GetTvlHistoricalResult = ResultOf<
  typeof tvlHistoricalQuery
>["steakhouseTvl"]["historical"]

/**
 * Get daily historical TVL snapshots (last 365 days, oldest first).
 */
export async function getTvlHistorical(client: SteakhouseClient): Promise<GetTvlHistoricalResult> {
  const result = await client.query(tvlHistoricalQuery, {})
  return result.steakhouseTvl.historical
}
