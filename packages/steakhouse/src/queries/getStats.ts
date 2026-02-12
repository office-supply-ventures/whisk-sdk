import { graphql, type ResultOf } from "@whisk/graphql"
import type { SteakhouseClient } from "../client.js"

const tvlSnapshotFragment = graphql(`
  fragment TvlSnapshot on SteakhouseTvlSnapshot {
    timestamp
    totalUsd
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
`)

const statsQuery = graphql(
  `
  query GetSteakhouseStats($includeHistorical: Boolean!) {
    steakhouseStats {
      uniqueDepositors

      tvl {
        current {
          ...TvlSnapshot
        }
        historical @include(if: $includeHistorical) {
          ...TvlSnapshot
        }
      }
    }
  }
`,
  [tvlSnapshotFragment],
)

type GetStatsResult = ResultOf<typeof statsQuery>["steakhouseStats"]

export type GetStatsResultWithHistorical = GetStatsResult & {
  tvl: GetStatsResult["tvl"] & {
    historical: NonNullable<GetStatsResult["tvl"]["historical"]>
  }
}

export type GetStatsResultWithoutHistorical = Omit<GetStatsResult, "tvl"> & {
  tvl: Pick<GetStatsResult["tvl"], "current">
}

/**
 * Get Steakhouse stats: unique depositor count and current TVL breakdown.
 * Pass `{ includeHistorical: true }` to also fetch daily historical TVL snapshots (last 365 days).
 */
export async function getStats(
  client: SteakhouseClient,
  options: { includeHistorical: true },
): Promise<GetStatsResultWithHistorical>
export async function getStats(
  client: SteakhouseClient,
  options?: { includeHistorical?: false },
): Promise<GetStatsResultWithoutHistorical>
export async function getStats(
  client: SteakhouseClient,
  options?: { includeHistorical?: boolean },
) {
  const result = await client.query(statsQuery, {
    includeHistorical: options?.includeHistorical ?? false,
  })
  return result.steakhouseStats
}
