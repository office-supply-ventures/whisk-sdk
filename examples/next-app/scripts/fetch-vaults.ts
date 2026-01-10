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
  const vaults = await getVaults(steakhouseClient, { limit: 5 })

  console.log(`Found ${vaults.length} vaults:\n`)

  for (const vault of vaults) {
    if (vault) {
      console.log(`  Chain: ${vault.chain.id}`)
      console.log(`  Address: ${vault.vaultAddress}`)
      console.log(`  Total Supplied: ${vault.totalSupplied.raw}`)
      console.log("")
    }
  }
}

main().catch(console.error)
