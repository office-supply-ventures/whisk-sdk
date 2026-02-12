/**
 * Example script demonstrating server-side usage of @whisk/steakhouse
 *
 * Run with: pnpm --filter next-app exec tsx scripts/fetch-vaults.ts
 */
import "dotenv/config"
import { getStats } from "@whisk/steakhouse"
import { steakhouseClient } from "../lib/steakhouse"

async function main() {
  console.log("Fetching stats...")
  const stats = await getStats(steakhouseClient)

  console.log(`\nUnique Depositors: ${stats.uniqueDepositors?.toLocaleString() ?? "N/A"}`)
  console.log(`Total TVL: $${stats.tvl.current.totalUsd.toLocaleString()}\n`)

  console.log("By Chain:")
  for (const item of stats.tvl.current.byChain) {
    console.log(`  ${item.chain.name}: $${item.tvlUsd.toLocaleString()}`)
  }

  console.log("\nBy Protocol:")
  for (const item of stats.tvl.current.byProtocol) {
    console.log(`  ${item.protocol}: $${item.tvlUsd.toLocaleString()}`)
  }

  console.log("\nBy Asset Category:")
  for (const item of stats.tvl.current.byAssetCategory) {
    console.log(`  ${item.category}: $${item.tvlUsd.toLocaleString()}`)
  }
}

main().catch(console.error)
