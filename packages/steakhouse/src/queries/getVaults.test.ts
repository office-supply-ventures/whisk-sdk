import { beforeEach, describe, expect, it, vi } from "vitest"
import { createMockClient } from "../../test/mocks.js"
import { getVaults } from "./getVaults.js"

// Mock the generated vaults module
vi.mock("../metadata/generated/vaults.js", () => ({
  STEAKHOUSE_VAULTS: [
    {
      chainId: 1,
      address: "0x1111111111111111111111111111111111111111",
      protocol: "morpho_v1",
      name: "Steakhouse USDC",
      description: "A USDC vault",
      type: "Prime",
    },
    {
      chainId: 1,
      address: "0x2222222222222222222222222222222222222222",
      protocol: "morpho_v1",
      name: "Steakhouse ETH",
      description: "An ETH vault",
    },
    {
      chainId: 8453,
      address: "0x3333333333333333333333333333333333333333",
      protocol: "morpho_v2",
      name: "Base Vault",
      description: "A Base vault",
    },
  ],
}))

function createMockVaultResponse(vaults: Array<{ vaultAddress: string }>) {
  return {
    erc4626Vaults: {
      items: vaults.map((v) => ({
        chain: { id: 1, name: "Ethereum", icon: "https://chain.icon" },
        vaultAddress: v.vaultAddress,
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
        apy: { base: 0.05, total: 0.08, rewards: [], fee: 0.1 },
        performanceFee: 0.1,
        feeRecipientAddress: "0xfee",
        ownerAddress: "0xowner",
        curatorAddress: "0xcurator",
        guardianAddress: "0xguardian",
        metadata: {
          description: "A vault",
          image: null,
          forumLink: null,
          curator: null,
          curators: [],
        },
        marketAllocations: [],
        riskAssessment: { steakhouse: { score: 0.8, rating: "A" } },
      })),
    },
  }
}

describe("getVaults", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns empty array when no vaults in whitelist match filter", async () => {
    const client = createMockClient({ erc4626Vaults: { items: [] } })

    // Filter for a chain with no vaults
    const result = await getVaults(client, { chainId: 999 })

    expect(result).toEqual([])
    // Should not call API if no vaults match
    expect(client.query).not.toHaveBeenCalled()
  })

  it("filters vaults by chainId", async () => {
    const client = createMockClient(
      createMockVaultResponse([
        { vaultAddress: "0x1111111111111111111111111111111111111111" },
        { vaultAddress: "0x2222222222222222222222222222222222222222" },
      ]),
    )

    const result = await getVaults(client, { chainId: 1 })

    expect(result).toHaveLength(2)
    expect(client.query).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        where: expect.objectContaining({
          keys: expect.arrayContaining([
            expect.objectContaining({
              chainId: 1,
              vaultAddress: "0x1111111111111111111111111111111111111111",
              protocol: "morpho_v1",
            }),
            expect.objectContaining({
              chainId: 1,
              vaultAddress: "0x2222222222222222222222222222222222222222",
              protocol: "morpho_v1",
            }),
          ]),
        }),
      }),
    )
  })

  it("augments results with steakhouse metadata", async () => {
    const client = createMockClient(
      createMockVaultResponse([{ vaultAddress: "0x1111111111111111111111111111111111111111" }]),
    )

    const result = await getVaults(client, { chainId: 1 })

    expect(result[0]?.steakhouseMetadata).toEqual({
      name: "Steakhouse USDC",
      description: "A USDC vault",
      type: "Prime",
      protocol: "morpho_v1",
    })
  })

  it("handles vaults without type", async () => {
    const client = createMockClient(
      createMockVaultResponse([{ vaultAddress: "0x3333333333333333333333333333333333333333" }]),
    )

    const result = await getVaults(client, { chainId: 8453 })

    expect(result[0]?.steakhouseMetadata).toEqual({
      name: "Base Vault",
      description: "A Base vault",
      protocol: "morpho_v2",
    })
  })

  it("returns all vaults when no chainId filter", async () => {
    const client = createMockClient(
      createMockVaultResponse([
        { vaultAddress: "0x1111111111111111111111111111111111111111" },
        { vaultAddress: "0x2222222222222222222222222222222222222222" },
        { vaultAddress: "0x3333333333333333333333333333333333333333" },
      ]),
    )

    await getVaults(client)

    expect(client.query).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        limit: 3,
      }),
    )
  })
})
