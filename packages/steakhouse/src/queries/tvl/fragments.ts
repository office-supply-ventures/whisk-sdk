import { graphql } from "@whisk/graphql"

export const tvlSnapshotFragment = graphql(`
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
