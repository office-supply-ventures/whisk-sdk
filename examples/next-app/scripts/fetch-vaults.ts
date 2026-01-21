/**
 * Example script demonstrating server-side usage of @whisk/steakhouse
 *
 * Run with: pnpm --filter next-app exec tsx scripts/fetch-vaults.ts
 */
import "dotenv/config"
import { getTvl } from "@whisk/steakhouse"
import { steakhouseClient } from "../lib/steakhouse"

async function main() {
  console.log("Fetching TVL...")
  const tvl = await getTvl(steakhouseClient)

  console.log(`\nTotal TVL: $${tvl.totalUsd.toLocaleString()}\n`)

  console.log("By Chain:")
  for (const item of tvl.byChain) {
    console.log(`  ${item.chain.name}: $${item.tvlUsd.toLocaleString()}`)
  }

  console.log("\nBy Protocol:")
  for (const item of tvl.byProtocol) {
    console.log(`  ${item.protocol}: $${item.tvlUsd.toLocaleString()}`)
  }

  console.log("\nBy Asset Category:")
  for (const item of tvl.byAssetCategory) {
    console.log(`  ${item.category}: $${item.tvlUsd.toLocaleString()}`)
  }
}

main().catch(console.error)
