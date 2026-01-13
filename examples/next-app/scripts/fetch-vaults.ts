/**
 * Example script demonstrating server-side usage of @whisk/steakhouse
 *
 * Run with: pnpm --filter next-app exec tsx scripts/fetch-vaults.ts
 */
import "dotenv/config"
import { getVaults } from "@whisk/steakhouse"
import { steakhouseClient } from "../lib/steakhouse"

async function main() {
  console.log("Fetching vaults...")
  const vaults = await getVaults(steakhouseClient, { chainId: 1 })

  console.log(`Found ${vaults.length} vaults:\n`)

  for (const vault of vaults.slice(0, 5)) {
    console.log(`  Chain: ${vault.chain.id}`)
    console.log(`  Address: ${vault.vaultAddress}`)
    console.log(`  Total Assets: ${vault.totalAssets.raw}`)
    console.log("")
  }
}

main().catch(console.error)
