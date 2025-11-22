import { type FragmentOf, graphql } from "@whisk/graphql"

export const vaultSummaryFragment = graphql(`
  fragment VaultSummaryFragment on MorphoVault {
    chain {
      id
    }
    vaultAddress
    totalSupplied {
      raw
    }
  }
`)

export type VaultSummary = FragmentOf<typeof vaultSummaryFragment>
