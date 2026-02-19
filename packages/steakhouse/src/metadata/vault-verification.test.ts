/**
 * Integration test to verify vault addresses were created by a Morpho factory
 * and have the correct curator.
 */

import { addresses as morphoAddresses } from "@morpho-org/blue-sdk"
import { type Address, type Chain, createPublicClient, http } from "viem"
import { arbitrum, base, katana, mainnet, monad, polygon, unichain } from "viem/chains"
import { describe, expect, it } from "vitest"
import { STEAKHOUSE_VAULTS } from "./generated/vaults.js"

/** Steakhouse curator address */
const STEAKHOUSE_CURATOR: Address = "0x827e86072B06674a077f592A531dcE4590aDeCdB"

/** Vaults excluded from curator check (partnership vaults with different curators) */
const CURATOR_CHECK_EXCLUSIONS: Address[] = [
  "0x7204B7Dbf9412567835633B6F00C3Edc3a8D6330", // Coinshift USDC Prime (mainnet)
]

const curatorAbi = [
  {
    name: "curator",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address" }],
  },
] as const

const metaMorphoFactoryAbi = [
  {
    name: "isMetaMorpho",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "target", type: "address" }],
    outputs: [{ type: "bool" }],
  },
] as const

const vaultV2FactoryAbi = [
  {
    name: "isVaultV2",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "target", type: "address" }],
    outputs: [{ type: "bool" }],
  },
] as const

/** Chain configuration mapping chainId to viem Chain */
const chainConfigs: Record<number, Chain> = {
  [mainnet.id]: mainnet,
  [base.id]: base,
  [arbitrum.id]: arbitrum,
  [polygon.id]: polygon,
  [unichain.id]: unichain,
  [monad.id]: monad,
  [katana.id]: katana,
}

/** Override default RPCs that are broken, rate-limited, or require auth */
const rpcOverrides: Record<number, string> = {
  [mainnet.id]: "https://gateway.tenderly.co/public/mainnet",
  [base.id]: "https://gateway.tenderly.co/public/base",
  [polygon.id]: "https://gateway.tenderly.co/public/polygon",
}

/** MetaMorpho v1.0 factory - same address on mainnet and base (not in SDK) */
const METAMORPHO_V1_0_FACTORY: Address = "0xA9c3D3a366466Fa809d1Ae982Fb2c46E5fC41101"

interface FactoryAddresses {
  metaMorphoV1_0Factory?: Address
  metaMorphoV1_1Factory?: Address
  vaultV2Factory?: Address
}

/** Get factory addresses from morpho SDK + hardcoded v1.0 */
function getFactoryAddresses(chainId: number): FactoryAddresses {
  const chainAddresses = morphoAddresses[chainId as keyof typeof morphoAddresses]
  if (!chainAddresses) return {}

  // v1.0 factory only exists on mainnet and base
  const hasV1_0 = chainId === mainnet.id || chainId === base.id

  const result: FactoryAddresses = {}
  if (hasV1_0) result.metaMorphoV1_0Factory = METAMORPHO_V1_0_FACTORY
  if (chainAddresses.metaMorphoFactory)
    result.metaMorphoV1_1Factory = chainAddresses.metaMorphoFactory as Address
  if (chainAddresses.vaultV2Factory)
    result.vaultV2Factory = chainAddresses.vaultV2Factory as Address
  return result
}

/** Create a viem client for a chain with multicall batching enabled */
function createClient(chainId: number) {
  const chain = chainConfigs[chainId]
  if (!chain) return null

  const rpcUrl = rpcOverrides[chainId]

  return createPublicClient({
    chain,
    transport: http(rpcUrl),
    batch: {
      multicall: true,
    },
  })
}

/** Group vaults by chainId */
function groupVaultsByChain() {
  return Map.groupBy(STEAKHOUSE_VAULTS, (vault) => vault.chainId)
}

describe("Vault Deployment Verification", () => {
  const vaultsByChain = groupVaultsByChain()

  for (const [chainId, vaults] of vaultsByChain) {
    const chain = chainConfigs[chainId]

    // Fail if chain config is missing
    if (!chain) {
      it(`Chain ${chainId}: has chain config`, () => {
        expect.fail(`Missing chain config for chainId ${chainId} (${vaults.length} vaults)`)
      })
      continue
    }

    describe(`Chain ${chainId} (${chain.name})`, () => {
      const client = createClient(chainId)

      if (!client) {
        it.skip("Client not available", () => {})
        return
      }

      // Test: Verify vaults were created by a Morpho factory (v1.0, v1.1, or v2)
      // Factory validation implies the vault is deployed and valid
      const factories = getFactoryAddresses(chainId)
      const hasFactory =
        factories.metaMorphoV1_0Factory ||
        factories.metaMorphoV1_1Factory ||
        factories.vaultV2Factory

      // Test: Verify all vaults have Steakhouse as curator
      const exclusionsLower = CURATOR_CHECK_EXCLUSIONS.map((a) => a.toLowerCase())
      const vaultsToCheckCurator = vaults.filter(
        (v) => !exclusionsLower.includes(v.address.toLowerCase()),
      )

      it(`all ${vaultsToCheckCurator.length} vaults have Steakhouse curator`, async () => {
        const curatorResults = await Promise.all(
          vaultsToCheckCurator.map(async (vault) => {
            const vaultAddress = vault.address as Address
            try {
              const curator = await client.readContract({
                address: vaultAddress,
                abi: curatorAbi,
                functionName: "curator",
              })
              return { vault, curator, error: null }
            } catch (e) {
              return { vault, curator: null, error: (e as Error).message }
            }
          }),
        )

        const failures: { address: string; curator: string }[] = []
        for (const { vault, curator, error } of curatorResults) {
          if (error) {
            failures.push({ address: vault.address, curator: `Error: ${error.slice(0, 50)}` })
          } else if (curator?.toLowerCase() !== STEAKHOUSE_CURATOR.toLowerCase()) {
            failures.push({ address: vault.address, curator: curator ?? "null" })
          }
        }

        if (failures.length > 0) {
          console.log(
            `\n[Chain ${chainId}] Vaults with unexpected curator (expected ${STEAKHOUSE_CURATOR}):`,
          )
          console.table(failures)
        }

        expect(failures.length, `${failures.length} vaults have wrong curator`).toBe(0)
      }, 60000)

      if (hasFactory) {
        it(`all ${vaults.length} vaults are from Morpho factory`, async () => {
          const factoryCheckResults = await Promise.all(
            vaults.map(async (vault) => {
              const vaultAddress = vault.address as Address
              let isFromFactory = false

              // Check MetaMorpho v1.0 factory
              if (factories.metaMorphoV1_0Factory) {
                const isV1_0 = await client
                  .readContract({
                    address: factories.metaMorphoV1_0Factory,
                    abi: metaMorphoFactoryAbi,
                    functionName: "isMetaMorpho",
                    args: [vaultAddress],
                  })
                  .catch(() => false)
                if (isV1_0) isFromFactory = true
              }

              // Check MetaMorpho v1.1 factory
              if (!isFromFactory && factories.metaMorphoV1_1Factory) {
                const isV1_1 = await client
                  .readContract({
                    address: factories.metaMorphoV1_1Factory,
                    abi: metaMorphoFactoryAbi,
                    functionName: "isMetaMorpho",
                    args: [vaultAddress],
                  })
                  .catch(() => false)
                if (isV1_1) isFromFactory = true
              }

              // Check VaultV2 factory
              if (!isFromFactory && factories.vaultV2Factory) {
                const isV2 = await client
                  .readContract({
                    address: factories.vaultV2Factory,
                    abi: vaultV2FactoryAbi,
                    functionName: "isVaultV2",
                    args: [vaultAddress],
                  })
                  .catch(() => false)
                if (isV2) isFromFactory = true
              }

              return { vault, isFromFactory }
            }),
          )

          const failures: { address: string }[] = []
          for (const { vault, isFromFactory } of factoryCheckResults) {
            if (!isFromFactory) {
              failures.push({ address: vault.address })
            }
          }

          if (failures.length > 0) {
            console.log(`\n[Chain ${chainId}] Vaults NOT from Morpho factory:`)
            console.log(`  v1.0: ${factories.metaMorphoV1_0Factory ?? "none"}`)
            console.log(`  v1.1: ${factories.metaMorphoV1_1Factory ?? "none"}`)
            console.log(`  v2: ${factories.vaultV2Factory ?? "none"}`)
            console.table(failures)
          }

          expect(failures.length, `${failures.length} vaults not from factory`).toBe(0)
        }, 60000)
      } else {
        it.skip(`No Morpho factory configured for chain ${chainId}`, () => {})
      }
    })
  }

  it("has vaults configured for expected chains", () => {
    const chainIds = [...vaultsByChain.keys()].sort((a, b) => a - b)

    // We expect vaults on these chains at minimum
    expect(chainIds).toContain(1) // Mainnet
    expect(chainIds).toContain(8453) // Base

    console.log(`\nTotal vaults: ${STEAKHOUSE_VAULTS.length}`)
    console.log(`Expected curator: ${STEAKHOUSE_CURATOR}`)
    console.log(`Chains: ${chainIds.join(", ")}\n`)

    const tableData = [...vaultsByChain.entries()].map(([chainId, vaults]) => {
      const chain = chainConfigs[chainId]
      const factories = getFactoryAddresses(chainId)
      return {
        Chain: chain?.name ?? `Chain ${chainId}`,
        Vaults: vaults.length,
        "MetaMorpho v1.0 Factory": factories.metaMorphoV1_0Factory ?? "-",
        "MetaMorpho v1.1 Factory": factories.metaMorphoV1_1Factory ?? "-",
        "Vault v2 Factory": factories.vaultV2Factory ?? "-",
      }
    })

    console.table(tableData)
  })
})
