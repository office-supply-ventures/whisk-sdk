import { describe, expect, it } from "vitest"
import { WhiskClient } from "./WhiskClient.js"

describe("WhiskClient", () => {
  it("creates client with config", () => {
    const client = new WhiskClient({
      apiKey: "test-key",
    })
    expect(client).toBeDefined()
  })

  it("creates client with custom url", () => {
    const client = new WhiskClient({
      apiKey: "test-key",
      url: "https://custom.api.example.com/graphql",
    })
    expect(client).toBeDefined()
  })

  it("creates client with debug mode", () => {
    const client = new WhiskClient({
      apiKey: "test-key",
      debug: true,
    })
    expect(client).toBeDefined()
  })
})
