import { beforeEach, describe, expect, it, vi } from "vitest"
import { createMockClient } from "../../test/mocks.js"
import { getDetailedVault } from "./getDetailedVault.js"

// Mock the metadata module
vi.mock("../metadata/vaults.js", () => ({
  ALL_VAULTS: [
    {
      chainId: 1,
      address: "0x1111111111111111111111111111111111111111",
      protocol: "morpho_v1",
      name: "Steakhouse USDC",
      description: "A USDC vault",
      tag: "featured",
    },
    {
      chainId: 1,
      address: "0x2222222222222222222222222222222222222222",
      protocol: "morpho_v1",
      isHidden: true, // Should be excluded
    },
  ],
}))

function createMockVaultDetailResponse(vault: { vaultAddress: string } | null) {
  if (!vault) {
    return { erc4626Vaults: { items: [] } }
  }

  return {
    erc4626Vaults: {
      items: [
        {
          chain: { id: 1, name: "Ethereum", icon: "https://eth.icon" },
          vaultAddress: vault.vaultAddress,
          name: "API Vault Name",
          symbol: "VAULT",
          decimals: 18,
          asset: {
            address: "0xasset",
            symbol: "USDC",
            name: "USD Coin",
            icon: "https://icon.url",
            priceUsd: 1.0,
            decimals: 6,
          },
          totalAssets: { raw: "1000000000000", formatted: "1000000", usd: 1000000 },
          totalLiquidity: { formatted: "500000", usd: 500000 },
          apy: {
            base: 0.05,
            total: 0.08,
            rewards: [{ token: { symbol: "MORPHO", icon: "https://morpho.icon" }, apr: 0.03 }],
            fee: 0.01,
          },
          performanceFee: 0.1,
          feeRecipientAddress: "0xfee",
          ownerAddress: "0xowner",
          curatorAddress: "0xcurator",
          guardianAddress: "0xguardian",
          metadata: {
            description: "API description",
            image: "https://image.url",
            forumLink: "https://forum.url",
            curator: {
              name: "Curator",
              image: "https://curator.image",
              url: "https://curator.url",
            },
            curators: [],
          },
          marketAllocations: [],
          riskAssessment: { steakhouse: { score: 0.8, rating: "A" } },
          // Historical data (only in historical query)
          historical: {
            daily: [
              {
                bucketTimestamp: 1704067200,
                totalSupplied: { formatted: "1000000", usd: 1000000 },
                supplyApy7d: { total: 0.08 },
              },
            ],
          },
        },
      ],
    },
  }
}

describe("getDetailedVault", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns null for vault not in whitelist", async () => {
    const client = createMockClient({})

    const result = await getDetailedVault(client, {
      chainId: 1,
      address: "0x9999999999999999999999999999999999999999",
    })

    expect(result).toBeNull()
    expect(client.query).not.toHaveBeenCalled()
  })

  it("returns null for hidden vault", async () => {
    const client = createMockClient({})

    const result = await getDetailedVault(client, {
      chainId: 1,
      address: "0x2222222222222222222222222222222222222222",
    })

    expect(result).toBeNull()
    expect(client.query).not.toHaveBeenCalled()
  })

  it("returns null for vault on wrong chain", async () => {
    const client = createMockClient({})

    const result = await getDetailedVault(client, {
      chainId: 8453, // Wrong chain
      address: "0x1111111111111111111111111111111111111111",
    })

    expect(result).toBeNull()
    expect(client.query).not.toHaveBeenCalled()
  })

  it("returns vault with historical data by default", async () => {
    const client = createMockClient(
      createMockVaultDetailResponse({
        vaultAddress: "0x1111111111111111111111111111111111111111",
      }),
    )

    const result = await getDetailedVault(client, {
      chainId: 1,
      address: "0x1111111111111111111111111111111111111111",
    })

    expect(result).not.toBeNull()
    expect(result?.historical).toBeDefined()
  })

  it("can exclude historical data", async () => {
    const mockResponse = createMockVaultDetailResponse({
      vaultAddress: "0x1111111111111111111111111111111111111111",
    })
    // Remove historical from response
    delete (mockResponse.erc4626Vaults.items[0] as Record<string, unknown>).historical

    const client = createMockClient(mockResponse)

    const result = await getDetailedVault(client, {
      chainId: 1,
      address: "0x1111111111111111111111111111111111111111",
      historical: false,
    })

    expect(result).not.toBeNull()
    // Different query should be called (without historical fragment)
    expect(client.query).toHaveBeenCalled()
  })

  it("augments result with steakhouse metadata", async () => {
    const client = createMockClient(
      createMockVaultDetailResponse({
        vaultAddress: "0x1111111111111111111111111111111111111111",
      }),
    )

    const result = await getDetailedVault(client, {
      chainId: 1,
      address: "0x1111111111111111111111111111111111111111",
    })

    expect(result?.steakhouseMetadata).toEqual({
      name: "Steakhouse USDC",
      description: "A USDC vault",
      tag: "featured",
      protocol: "morpho_v1",
    })
  })

  it("handles case-insensitive address matching", async () => {
    const client = createMockClient(
      createMockVaultDetailResponse({
        vaultAddress: "0x1111111111111111111111111111111111111111",
      }),
    )

    const result = await getDetailedVault(client, {
      chainId: 1,
      // Uppercase address
      address: "0x1111111111111111111111111111111111111111".toUpperCase() as `0x${string}`,
    })

    expect(result).not.toBeNull()
  })

  it("returns null when API returns no results", async () => {
    const client = createMockClient(createMockVaultDetailResponse(null))

    const result = await getDetailedVault(client, {
      chainId: 1,
      address: "0x1111111111111111111111111111111111111111",
    })

    expect(result).toBeNull()
  })
})
