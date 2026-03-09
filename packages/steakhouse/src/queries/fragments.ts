import { graphql } from "@whisk/graphql"
import { isAddressEqual } from "viem"
import { STEAKHOUSE_VAULTS } from "../metadata/generated/vaults.js"
import type { VaultConfig } from "../metadata/types.js"

export type Prettify<T> = { [K in keyof T]: T[K] } & {}

export interface VaultKeyVariables {
  chainId: number
  vaultAddress: `0x${string}`
}

export function resolveVaultConfig(variables: VaultKeyVariables): VaultConfig | undefined {
  return STEAKHOUSE_VAULTS.find(
    (v) => v.chainId === variables.chainId && isAddressEqual(v.address, variables.vaultAddress),
  )
}

export const chainFragment = graphql(`
  fragment ChainFields on Chain {
    id
    name
    icon
  }
`)

export const erc20Fragment = graphql(`
  fragment Erc20Fields on Erc20 {
    address
    name
    symbol
    decimals
    icon
    priceUsd
  }
`)

export const tokenAmountFragment = graphql(`
  fragment TokenAmountFields on TokenAmount {
    raw
    formatted
    usd
  }
`)

export const riskAssessmentFragment = graphql(`
  fragment RiskAssessmentFields on RiskAssessment {
    steakhouse {
      score
      rating
    }
  }
`)

export const apyFragment = graphql(
  `
  fragment ApyFields on Apy {
    base
    rewards {
      asset {
        ...Erc20Fields
      }
      apr
    }
    fee
    total
  }
`,
  [erc20Fragment],
)

export const morphoMarketAllocationFragment = graphql(
  `
  fragment MorphoMarketAllocationFields on MorphoMarket {
    marketId
    name
    loanAsset {
      ...Erc20Fields
    }
    collateralAsset {
      ...Erc20Fields
      yield {
        intrinsicApy
      }
    }
    lltv {
      raw
      formatted
    }
    riskAssessment {
      ...RiskAssessmentFields
    }
    supplyApy {
      ...ApyFields
    }
    supplyApy1d {
      ...ApyFields
    }
    supplyApy7d {
      ...ApyFields
    }
    supplyApy30d {
      ...ApyFields
    }
  }
`,
  [erc20Fragment, riskAssessmentFragment, apyFragment],
)

export const morphoVaultHistoricalEntryFragment = graphql(
  `
  fragment MorphoVaultHistoricalEntryFields on MorphoVaultHistoricalEntry {
    bucketTimestamp
    totalSupplied {
      ...TokenAmountFields
    }
    supplyApy1d {
      ...ApyFields
    }
    supplyApy7d {
      ...ApyFields
    }
    supplyApy30d {
      ...ApyFields
    }
  }
`,
  [tokenAmountFragment, apyFragment],
)

export const vaultSummaryFragment = graphql(
  `
  fragment VaultSummaryFields on Erc4626Vault {
    __typename
    chain {
      ...ChainFields
    }
    ...Erc20Fields
    asset {
      ...Erc20Fields
    }
    totalAssets {
      ...TokenAmountFields
    }
    apyInstant: apy(timeframe: instant) {
      ...ApyFields
    }
    apy1d: apy(timeframe: one_day) {
      ...ApyFields
    }
    apy7d: apy(timeframe: seven_days) {
      ...ApyFields
    }
    apy30d: apy(timeframe: thirty_days) {
      ...ApyFields
    }
    riskAssessment {
      ...RiskAssessmentFields
    }
  }
`,
  [chainFragment, erc20Fragment, tokenAmountFragment, apyFragment, riskAssessmentFragment],
)
