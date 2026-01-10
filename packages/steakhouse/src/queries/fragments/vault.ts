import { type FragmentOf, graphql } from "@whisk/graphql"

export const vaultFragment = graphql(`
  fragment VaultFragment on MorphoVault {
    chain {
      id
    }
    vaultAddress
    totalSupplied {
      raw
    }
  }
`)

export type Vault = FragmentOf<typeof vaultFragment>
