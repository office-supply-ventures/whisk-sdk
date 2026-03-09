import { graphql, type ResultOf } from "@whisk/graphql"
import type { SteakhouseClient } from "../client.js"
import { STEAKHOUSE_VAULTS } from "../metadata/generated/vaults.js"
import type { VaultConfig } from "../metadata/types.js"
import { type Prettify, vaultSummaryFragment } from "./fragments.js"

const vaultsQuery = graphql(
  `
  query GetSteakhouseVaults($keys: [Erc4626VaultKey!]!) {
    erc4626Vaults(where: { keys: $keys }) {
      items {
        ...VaultSummaryFields
      }
    }
  }
`,
  [vaultSummaryFragment],
)

type VaultItem = NonNullable<ResultOf<typeof vaultsQuery>["erc4626Vaults"]["items"][number]>

export type SteakhouseVaultSummary = Prettify<
  VaultItem & {
    strategy: VaultConfig["strategy"]
    isListed: boolean
  }
>

export async function getVaults(client: SteakhouseClient): Promise<SteakhouseVaultSummary[]> {
  const configs = STEAKHOUSE_VAULTS

  const keys = configs.map((v) => ({
    chainId: v.chainId,
    vaultAddress: v.address,
    protocol: v.protocol,
  }))

  const result = await client.query(vaultsQuery, { keys })

  const configByChainAndAddress = new Map(
    configs.map((v) => [`${v.chainId}:${v.address.toLowerCase()}`, v]),
  )

  const vaults: SteakhouseVaultSummary[] = []
  for (const item of result.erc4626Vaults.items) {
    if (!item) continue
    const config = configByChainAndAddress.get(`${item.chain.id}:${item.address.toLowerCase()}`)
    if (!config) {
      console.warn(
        `[getVaults] Vault ${item.address} on chain ${item.chain.id} has no matching config, skipping`,
      )
      continue
    }

    vaults.push({
      ...item,
      name: config.name ?? item.name,
      strategy: config.strategy,
      isListed: config.isListed,
    })
  }

  return vaults
}
