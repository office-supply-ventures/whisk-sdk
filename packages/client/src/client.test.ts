import { describe, test } from "vitest"
import { getVaultSummaries, WhiskClient } from "./index.js"

describe("dummy", () => {
  test("default", async () => {
    const whiskClient = new WhiskClient({
      url: "https://staging.api-v2.whisk.so/graphql",
      apiKey: process.env.WHISK_API_KEY as string,
    })

    const result = await getVaultSummaries(whiskClient, { limit: 10 })
    if (result.isOk()) {
      console.log(result.value.map((r) => r?.totalSupplied))
    }
  })
})
