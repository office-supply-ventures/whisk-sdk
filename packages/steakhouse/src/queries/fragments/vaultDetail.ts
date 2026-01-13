import { type FragmentOf, graphql } from "@whisk/graphql"

/**
 * Full fragment for vault detail view.
 * Uses inline fragments to handle both MorphoVault (v1) and MorphoVaultV2.
 */
export const vaultDetailFragment = graphql(`
  fragment VaultDetailFragment on Erc4626Vault {
    chain {
      id
      name
      icon
    }
    vaultAddress
    name
    symbol
    decimals
    asset {
      address
      symbol
      name
      icon
      priceUsd
      decimals
    }
    totalAssets {
      raw
      formatted
      usd
    }
    apy(timeframe: seven_days) {
      base
      total
      rewards {
        asset {
          symbol
          icon
        }
        apr
      }
      fee
    }
    ... on MorphoVault {
      totalLiquidity {
        formatted
        usd
      }
      v1PerformanceFee: performanceFee
      feeRecipientAddress
      ownerAddress
      curatorAddress
      guardianAddress
      metadata {
        description
        image
        forumLink
        curator {
          name
          image
          url
        }
        curators {
          name
          image
          url
        }
      }
      marketAllocations {
        market {
          marketId
          name
          loanAsset {
            symbol
            icon
          }
          collateralAsset {
            symbol
            icon
          }
          isIdle
        }
        enabled
        supplyCap {
          formatted
          usd
        }
        vaultSupplyShare
        marketSupplyShare
        position {
          supplyAmount {
            formatted
            usd
          }
        }
      }
      riskAssessment {
        steakhouse {
          score
          rating
        }
      }
    }
    ... on MorphoVaultV2 {
      curatorAddress
      ownerAddress
      metadata {
        description
        image
        forumLink
        curator {
          name
          image
          url
        }
        curators {
          name
          image
          url
        }
      }
      liquidityAssets {
        formatted
        usd
      }
      idleAssets {
        formatted
        usd
      }
      v2PerformanceFee: performanceFee {
        formatted
      }
      managementFee {
        formatted
      }
      adapters {
        ... on MarketV1Adapter {
          adapterAddress
          name
        }
      }
      riskAssessment {
        steakhouse {
          score
          rating
        }
      }
    }
  }
`)

export type VaultDetail = FragmentOf<typeof vaultDetailFragment>
