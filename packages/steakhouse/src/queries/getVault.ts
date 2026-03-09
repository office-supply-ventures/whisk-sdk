import { graphql, type ResultOf } from "@whisk/graphql"
import type { SteakhouseClient } from "../client.js"
import type { VaultConfig } from "../metadata/types.js"
import {
  apyFragment,
  erc20Fragment,
  morphoMarketAllocationFragment,
  type Prettify,
  resolveVaultConfig,
  riskAssessmentFragment,
  tokenAmountFragment,
  type VaultKeyVariables,
  vaultSummaryFragment,
} from "./fragments.js"

const vaultDetailQuery = graphql(
  `
  query GetSteakhouseVault($keys: [Erc4626VaultKey!]!) {
    erc4626Vaults(where: { keys: $keys }) {
      items {
        ...VaultSummaryFields

        # Morpho Vault V1 - full details
        ... on MorphoVault {
          totalLiquidity {
            ...TokenAmountFields
          }
          deploymentTimestamp
          performanceFeeV1: performanceFee
          curatorAddress
          guardianAddress
          allocations: marketAllocations {
            supplyCap {
              ...TokenAmountFields
            }
            market {
              ...MorphoMarketAllocationFields
            }
            position {
              supplyAmount {
                ...TokenAmountFields
              }
            }
          }
        }

        # Box Vault - full details
        ... on BoxVault {
          leverage
          allocations {
            token {
              ...Erc20Fields
              yield {
                intrinsicApy
              }
            }
            balance {
              ...TokenAmountFields
            }
          }
          fundingModules {
            fundingModuleAddress
            nav {
              ...TokenAmountFields
            }
            ... on BoxMorphoFundingModule {
              positions {
                market {
                  ...MorphoMarketAllocationFields
                  borrowApy {
                    ...ApyFields
                  }
                  borrowApy1d {
                    ...ApyFields
                  }
                  borrowApy7d {
                    ...ApyFields
                  }
                  borrowApy30d {
                    ...ApyFields
                  }
                }
                loopingLeverage
                loopingNetApy
                collateralAmount {
                  ...TokenAmountFields
                }
                borrowAmount {
                  ...TokenAmountFields
                }
              }
            }
          }
        }

        # Morpho Vault V2 - full details for market adapter, user meant to fetch vault adapter details separately if they want those
        ... on MorphoVaultV2 {
          deploymentTimestamp
          performanceFee {
            raw
            formatted
          }
          managementFee {
            raw
            formatted
          }
          nav {
            ...TokenAmountFields
          }
          liquidityAssets {
            ...TokenAmountFields
          }
          idleAssets {
            ...TokenAmountFields
          }
          allocations {
            adapterAddress
            name
            riskAssessment {
              ...RiskAssessmentFields
            }
            adapterCap {
              allocation {
                ...TokenAmountFields
              }
              absoluteCap {
                ...TokenAmountFields
              }
              relativeCap {
                raw
                formatted
              }
            }

            # For ERC-4626, expect user to call this again if they want full details on the adapters vault
            ... on Erc4626VaultAdapter {
              vault {
                __typename
                address
              }
            }

            ... on MarketV1Adapter {
              marketCaps {
                allocation {
                  ...TokenAmountFields
                }
                absoluteCap {
                  ...TokenAmountFields
                }
                market {
                  ...MorphoMarketAllocationFields
                }
              }
            }
          }
        }
      }
    }
  }
`,
  [
    vaultSummaryFragment,
    erc20Fragment,
    tokenAmountFragment,
    riskAssessmentFragment,
    apyFragment,
    morphoMarketAllocationFragment,
  ],
)

type VaultDetailItem = NonNullable<
  ResultOf<typeof vaultDetailQuery>["erc4626Vaults"]["items"][number]
>

export type SteakhouseVaultDetail = Prettify<
  VaultDetailItem & {
    strategy: VaultConfig["strategy"] | undefined
    description: VaultConfig["description"] | undefined
    isListed: boolean
  }
>

export interface GetVaultVariables extends VaultKeyVariables {
  isBox?: boolean
}

export async function getVault(
  client: SteakhouseClient,
  variables: GetVaultVariables,
): Promise<SteakhouseVaultDetail> {
  const config = resolveVaultConfig(variables)

  if (!config && !variables.isBox) {
    throw new Error(
      `Vault ${variables.vaultAddress} on chain ${variables.chainId} is not a known Steakhouse vault`,
    )
  }

  const result = await client.query(vaultDetailQuery, {
    keys: [
      {
        chainId: variables.chainId,
        vaultAddress: config?.address ?? variables.vaultAddress,
        protocol: config?.protocol ?? "box",
      },
    ],
  })

  const item = result.erc4626Vaults.items[0]
  if (!item) {
    throw new Error(`Vault ${variables.vaultAddress} on chain ${variables.chainId} was not found`)
  }

  return {
    ...item,
    name: config?.name ?? item.name,
    strategy: config?.strategy,
    description: config?.description,
    isListed: config?.isListed ?? false,
  }
}
