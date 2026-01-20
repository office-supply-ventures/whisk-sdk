import { initGraphQLTada } from "gql.tada"
import type { introspection } from "./generated/graphql-env.js"

export const graphql = initGraphQLTada<{
  disableMasking: true
  introspection: introspection
  scalars: {
    Address: `0x${string}` // string underlying
    ChainId: number // number underlying
    BigInt: bigint // string underlying, but assumes an exchange to convert at runtime (done in client)
    Hex: `0x${string}` // string underlying
    URL: string
  }
}>()

export type { FragmentOf, ResultOf, VariablesOf } from "gql.tada"
export { readFragment } from "gql.tada"

/** Vault protocol values - must match Erc4626VaultProtocol enum in GraphQL schema */
export const VAULT_PROTOCOLS = ["morpho_v1", "morpho_v2", "generic", "box"] as const
export type VaultProtocol = (typeof VAULT_PROTOCOLS)[number]
