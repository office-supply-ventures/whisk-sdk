import { graphql, type ResultOf } from "@whisk/graphql"
import type { SteakhouseClient } from "../../client.js"
import { tvlSnapshotFragment } from "./fragments.js"

const tvlQuery = graphql(
  `
    query GetSteakhouseTvl {
      steakhouseTvl {
        current {
          ...TvlSnapshot
        }
      }
    }
  `,
  [tvlSnapshotFragment],
)

export type GetTvlResult = ResultOf<typeof tvlQuery>["steakhouseTvl"]["current"]

/**
 * Get current Steakhouse TVL breakdown by chain, protocol, and asset category.
 */
export async function getTvl(client: SteakhouseClient): Promise<GetTvlResult> {
  const result = await client.query(tvlQuery, {})
  return result.steakhouseTvl.current
}
