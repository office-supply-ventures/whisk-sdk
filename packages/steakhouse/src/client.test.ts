import { describe, expect, it } from "vitest"
import { SteakhouseClient } from "./client.js"

describe("SteakhouseClient", () => {
  it("creates client with config", () => {
    const client = new SteakhouseClient({
      apiKey: "test-key",
    })
    expect(client).toBeDefined()
  })

  it("creates client with custom url", () => {
    const client = new SteakhouseClient({
      apiKey: "test-key",
      url: "https://custom.api.example.com/graphql",
    })
    expect(client).toBeDefined()
  })

  it("creates client with debug mode", () => {
    const client = new SteakhouseClient({
      apiKey: "test-key",
      debug: true,
    })
    expect(client).toBeDefined()
  })
})
