import { describe, expect, it } from "vitest"
import {
  generateCode,
  getChainFolder,
  type ParsedVault,
  parseVaultContent,
  VaultFrontmatterSchema,
  validateFolderConsistency,
  validateUniqueness,
} from "./generate-vaults.js"

describe("VaultFrontmatterSchema", () => {
  it("validates correct frontmatter", () => {
    const result = VaultFrontmatterSchema.safeParse({
      chainId: 1,
      vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
      protocol: "morpho_v2",
      name: "Test Vault",
    })

    expect(result.success).toBe(true)
  })

  it("rejects invalid chainId values", () => {
    const invalidChainIds = [-1, 0, 1.5, "1", null, undefined]

    for (const chainId of invalidChainIds) {
      const result = VaultFrontmatterSchema.safeParse({
        chainId,
        vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
        protocol: "morpho_v2",
      })
      expect(result.success).toBe(false)
    }
  })

  it("rejects invalid Ethereum addresses", () => {
    const invalidAddresses = [
      "not-an-address",
      "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64", // too short
      "0xGGGG01735c132Ada46AA9aA4c54623cAA92A64CB", // invalid hex
      "",
    ]

    for (const vaultAddress of invalidAddresses) {
      const result = VaultFrontmatterSchema.safeParse({
        chainId: 1,
        vaultAddress,
        protocol: "morpho_v2",
      })
      expect(result.success).toBe(false)
    }
  })

  it("checksums lowercase address", () => {
    const result = VaultFrontmatterSchema.safeParse({
      chainId: 1,
      vaultAddress: "0xbeef01735c132ada46aa9aa4c54623caa92a64cb",
      protocol: "morpho_v2",
      name: "Test Vault",
    })

    expect(result.success).toBe(true)
    if (result.success) {
      // Should be checksummed (mixed case)
      expect(result.data.vaultAddress).toBe("0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB")
    }
  })

  it("validates protocol enum", () => {
    const validProtocols = ["morpho_v1", "morpho_v2", "generic", "box"] as const
    const invalidProtocols = ["invalid_protocol", "morpho", ""]

    for (const protocol of validProtocols) {
      const result = VaultFrontmatterSchema.safeParse({
        chainId: 1,
        vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
        protocol,
      })
      expect(result.success).toBe(true)
    }

    for (const protocol of invalidProtocols) {
      const result = VaultFrontmatterSchema.safeParse({
        chainId: 1,
        vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
        protocol,
      })
      expect(result.success).toBe(false)
    }
  })

  it("allows optional name", () => {
    const result = VaultFrontmatterSchema.safeParse({
      chainId: 1,
      vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
      protocol: "morpho_v2",
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBeUndefined()
    }
  })

  it("rejects empty string name", () => {
    const result = VaultFrontmatterSchema.safeParse({
      chainId: 1,
      vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
      protocol: "morpho_v2",
      name: "",
    })

    expect(result.success).toBe(false)
  })

  it("validates strategy enum (optional, accepts valid values, rejects invalid)", () => {
    const validStrategies = ["Prime", "High Yield", "Turbo", "Term"] as const

    // Valid strategies should pass
    for (const strategy of validStrategies) {
      const result = VaultFrontmatterSchema.safeParse({
        chainId: 1,
        vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
        protocol: "morpho_v2",
        strategy,
      })
      expect(result.success).toBe(true)
    }

    // Invalid strategy should fail
    const invalidResult = VaultFrontmatterSchema.safeParse({
      chainId: 1,
      vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
      protocol: "morpho_v2",
      strategy: "invalid_strategy",
    })
    expect(invalidResult.success).toBe(false)

    // Optional - should work without strategy
    const optionalResult = VaultFrontmatterSchema.safeParse({
      chainId: 1,
      vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
      protocol: "morpho_v2",
    })
    expect(optionalResult.success).toBe(true)
    if (optionalResult.success) {
      expect(optionalResult.data.strategy).toBeUndefined()
    }
  })

  it("validates isListed boolean field with default true", () => {
    // Explicit true
    const trueResult = VaultFrontmatterSchema.safeParse({
      chainId: 1,
      vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
      protocol: "morpho_v2",
      isListed: true,
    })
    expect(trueResult.success).toBe(true)
    if (trueResult.success) {
      expect(trueResult.data.isListed).toBe(true)
    }

    // Explicit false
    const falseResult = VaultFrontmatterSchema.safeParse({
      chainId: 1,
      vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
      protocol: "morpho_v2",
      isListed: false,
    })
    expect(falseResult.success).toBe(true)
    if (falseResult.success) {
      expect(falseResult.data.isListed).toBe(false)
    }

    // Default to true when not provided
    const defaultResult = VaultFrontmatterSchema.safeParse({
      chainId: 1,
      vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
      protocol: "morpho_v2",
    })
    expect(defaultResult.success).toBe(true)
    if (defaultResult.success) {
      expect(defaultResult.data.isListed).toBe(true)
    }

    // Invalid value should fail
    const invalidResult = VaultFrontmatterSchema.safeParse({
      chainId: 1,
      vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
      protocol: "morpho_v2",
      isListed: "true", // string instead of boolean
    })
    expect(invalidResult.success).toBe(false)
  })
})

describe("parseVaultContent", () => {
  it("parses valid markdown with frontmatter", () => {
    const content = `---
chainId: 1
vaultAddress: "0xbeef01735c132ada46aa9aa4c54623caa92a64cb"
protocol: morpho_v2
name: Test Vault
strategy: Prime
---

This is the vault description.
`
    const result = parseVaultContent(content, "test.md")

    expect(result.chainId).toBe(1)
    expect(result.vaultAddress).toBe("0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB")
    expect(result.protocol).toBe("morpho_v2")
    expect(result.name).toBe("Test Vault")
    expect(result.strategy).toBe("Prime")
    expect(result.description).toBe("This is the vault description.")
    expect(result.filePath).toBe("test.md")
  })

  it("handles address without quotes in YAML", () => {
    // Using JSON_SCHEMA prevents YAML from parsing 0x as hex numbers
    const content = `---
chainId: 1
vaultAddress: 0xbeef01735c132ada46aa9aa4c54623caa92a64cb
protocol: morpho_v2
name: Test Vault
---

Description.
`
    const result = parseVaultContent(content, "test.md")

    // Should work and be checksummed
    expect(result.vaultAddress).toBe("0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB")
  })

  it("handles multiline descriptions", () => {
    const content = `---
chainId: 1
vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB"
protocol: morpho_v2
name: Test Vault
---

First paragraph.

Second paragraph with **bold** text.
`
    const result = parseVaultContent(content, "test.md")

    expect(result.description).toBe("First paragraph.\n\nSecond paragraph with **bold** text.")
  })

  it("handles empty description", () => {
    const content = `---
chainId: 1
vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB"
protocol: morpho_v2
name: Test Vault
---
`
    const result = parseVaultContent(content, "test.md")

    expect(result.description).toBe("")
  })

  it("trims whitespace-only description to empty string", () => {
    const content = `---
chainId: 1
vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB"
protocol: morpho_v2
name: Test Vault
---



`
    const result = parseVaultContent(content, "test.md")

    expect(result.description).toBe("")
  })

  it("throws on invalid frontmatter", () => {
    const content = `---
chainId: 1
vaultAddress: "invalid"
protocol: morpho_v2
name: Test Vault
---
`
    expect(() => parseVaultContent(content, "test.md")).toThrow("Invalid frontmatter in test.md")
  })

  it("throws on missing required field", () => {
    const content = `---
chainId: 1
vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB"
---
`
    expect(() => parseVaultContent(content, "test.md")).toThrow("Invalid frontmatter in test.md")
  })
})

describe("validateUniqueness", () => {
  it("passes for unique vaults", () => {
    const vaults: ParsedVault[] = [
      {
        chainId: 1,
        vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
        protocol: "morpho_v2",
        name: "Vault 1",
        description: "",
        filePath: "vault1.md",
        isListed: true,
      },
      {
        chainId: 1,
        vaultAddress: "0xbeef0046fcab1dE47E41fB75BB3dC4Dfc94108E3",
        protocol: "morpho_v2",
        name: "Vault 2",
        description: "",
        filePath: "vault2.md",
        isListed: true,
      },
    ]

    expect(() => validateUniqueness(vaults)).not.toThrow()
  })

  it("allows same address on different chains", () => {
    const vaults: ParsedVault[] = [
      {
        chainId: 1,
        vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
        protocol: "morpho_v2",
        name: "Vault Mainnet",
        description: "",
        filePath: "mainnet/vault.md",
        isListed: true,
      },
      {
        chainId: 8453,
        vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
        protocol: "morpho_v2",
        name: "Vault Base",
        description: "",
        filePath: "base/vault.md",
        isListed: true,
      },
    ]

    expect(() => validateUniqueness(vaults)).not.toThrow()
  })

  it("throws on duplicate chainId + address", () => {
    const vaults: ParsedVault[] = [
      {
        chainId: 1,
        vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
        protocol: "morpho_v2",
        name: "Vault 1",
        description: "",
        filePath: "vault1.md",
        isListed: true,
      },
      {
        chainId: 1,
        vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
        protocol: "morpho_v1",
        name: "Vault 2",
        description: "",
        filePath: "vault2.md",
        isListed: true,
      },
    ]

    expect(() => validateUniqueness(vaults)).toThrow("Duplicate vault found")
  })

  it("detects duplicates regardless of address case", () => {
    const vaults: ParsedVault[] = [
      {
        chainId: 1,
        vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
        protocol: "morpho_v2",
        name: "Vault 1",
        description: "",
        filePath: "vault1.md",
        isListed: true,
      },
      {
        chainId: 1,
        vaultAddress: "0xbeef01735c132ada46aa9aa4c54623caa92a64cb",
        protocol: "morpho_v1",
        name: "Vault 2",
        description: "",
        filePath: "vault2.md",
        isListed: true,
      },
    ]

    expect(() => validateUniqueness(vaults)).toThrow("Duplicate vault found")
  })
})

describe("generateCode", () => {
  it("generates valid TypeScript for single vault", () => {
    const vaults: ParsedVault[] = [
      {
        chainId: 1,
        vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
        protocol: "morpho_v2",
        name: "Test Vault",
        description: "A test vault",
        filePath: "test.md",
        isListed: true,
      },
    ]

    const code = generateCode(vaults)

    expect(code).toContain("// THIS FILE IS AUTO-GENERATED")
    expect(code).toContain('import type { VaultConfig } from "../types.js"')
    expect(code).toContain("export const STEAKHOUSE_VAULTS: readonly VaultConfig[]")
    expect(code).toContain("chainId: 1")
    expect(code).toContain('address: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB"')
    expect(code).toContain('protocol: "morpho_v2"')
    expect(code).toContain('name: "Test Vault"')
    expect(code).toContain('description: "A test vault"')
    expect(code).not.toContain("strategy:")
  })

  it("includes strategy when present", () => {
    const vaults: ParsedVault[] = [
      {
        chainId: 1,
        vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
        protocol: "morpho_v2",
        name: "Prime Vault",
        description: "",
        strategy: "Prime",
        filePath: "test.md",
        isListed: true,
      },
    ]

    const code = generateCode(vaults)

    expect(code).toContain('strategy: "Prime"')
  })

  it("conditionally includes description based on presence", () => {
    const withoutDescription = generateCode([
      {
        chainId: 1,
        vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
        protocol: "morpho_v2",
        description: "",
        filePath: "test.md",
        isListed: true,
      },
    ])
    expect(withoutDescription).not.toContain("description:")

    const withDescription = generateCode([
      {
        chainId: 1,
        vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
        protocol: "morpho_v2",
        description: "This vault has a description.",
        filePath: "test.md",
        isListed: true,
      },
    ])
    expect(withDescription).toContain('description: "This vault has a description."')
  })

  it("conditionally includes name based on presence", () => {
    const withoutName = generateCode([
      {
        chainId: 1,
        vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
        protocol: "morpho_v2",
        description: "",
        filePath: "test.md",
        isListed: true,
      },
    ])
    expect(withoutName).not.toContain("name:")

    const withName = generateCode([
      {
        chainId: 1,
        vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
        protocol: "morpho_v2",
        name: "Custom Name",
        description: "",
        filePath: "test.md",
        isListed: true,
      },
    ])
    expect(withName).toContain('name: "Custom Name"')
  })

  it("escapes special characters in name and description", () => {
    const vaults: ParsedVault[] = [
      {
        chainId: 1,
        vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
        protocol: "morpho_v2",
        name: 'Vault "Special"',
        description: "Description with\nnewline",
        filePath: "test.md",
        isListed: true,
      },
    ]

    const code = generateCode(vaults)

    // JSON.stringify should escape quotes and newlines
    expect(code).toContain('name: "Vault \\"Special\\""')
    expect(code).toContain('description: "Description with\\nnewline"')
  })

  it("generates empty array for no vaults", () => {
    const code = generateCode([])

    expect(code).toContain("export const STEAKHOUSE_VAULTS: readonly VaultConfig[] = [")
    expect(code).toContain("] as const")
  })

  it("includes isListed field in generated code", () => {
    const listedVault = generateCode([
      {
        chainId: 1,
        vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
        protocol: "morpho_v2",
        description: "",
        filePath: "test.md",
        isListed: true,
      },
    ])
    expect(listedVault).toContain("isListed: true")

    const unlistedVault = generateCode([
      {
        chainId: 1,
        vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
        protocol: "morpho_v2",
        description: "",
        filePath: "test.md",
        isListed: false,
      },
    ])
    expect(unlistedVault).toContain("isListed: false")
  })
})

describe("getChainFolder", () => {
  it("extracts chain folder from file path", () => {
    expect(getChainFolder("/vaults/mainnet/vault.md", "/vaults")).toBe("mainnet")
    expect(getChainFolder("/vaults/base/vault.md", "/vaults")).toBe("base")
  })

  it("returns null for files not in a subfolder", () => {
    expect(getChainFolder("/vaults/vault.md", "/vaults")).toBe(null)
  })

  it("handles nested paths", () => {
    expect(getChainFolder("/vaults/mainnet/subfolder/vault.md", "/vaults")).toBe("mainnet")
  })
})

describe("validateFolderConsistency", () => {
  it("passes when all vaults in folder have same chainId", () => {
    const vaults: ParsedVault[] = [
      {
        chainId: 1,
        vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
        protocol: "morpho_v2",
        name: "Vault 1",
        description: "",
        filePath: "/vaults/mainnet/vault1.md",
        isListed: true,
      },
      {
        chainId: 1,
        vaultAddress: "0xbeef0046fcab1dE47E41fB75BB3dC4Dfc94108E3",
        protocol: "morpho_v2",
        name: "Vault 2",
        description: "",
        filePath: "/vaults/mainnet/vault2.md",
        isListed: true,
      },
    ]

    expect(() => validateFolderConsistency(vaults, "/vaults")).not.toThrow()
  })

  it("passes for multiple folders with different chainIds", () => {
    const vaults: ParsedVault[] = [
      {
        chainId: 1,
        vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
        protocol: "morpho_v2",
        name: "Mainnet Vault",
        description: "",
        filePath: "/vaults/mainnet/vault.md",
        isListed: true,
      },
      {
        chainId: 8453,
        vaultAddress: "0xbeef0046fcab1dE47E41fB75BB3dC4Dfc94108E3",
        protocol: "morpho_v2",
        name: "Base Vault",
        description: "",
        filePath: "/vaults/base/vault.md",
        isListed: true,
      },
    ]

    expect(() => validateFolderConsistency(vaults, "/vaults")).not.toThrow()
  })

  it("throws when vaults in same folder have different chainIds", () => {
    const vaults: ParsedVault[] = [
      {
        chainId: 1,
        vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
        protocol: "morpho_v2",
        name: "Vault 1",
        description: "",
        filePath: "/vaults/mainnet/vault1.md",
        isListed: true,
      },
      {
        chainId: 8453, // Different chainId in same folder
        vaultAddress: "0xbeef0046fcab1dE47E41fB75BB3dC4Dfc94108E3",
        protocol: "morpho_v2",
        name: "Vault 2",
        description: "",
        filePath: "/vaults/mainnet/vault2.md",
        isListed: true,
      },
    ]

    expect(() => validateFolderConsistency(vaults, "/vaults")).toThrow("Inconsistent chainId")
    expect(() => validateFolderConsistency(vaults, "/vaults")).toThrow('"mainnet/" folder')
  })

  it("skips files not in a subfolder", () => {
    const vaults: ParsedVault[] = [
      {
        chainId: 999,
        vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
        protocol: "morpho_v2",
        name: "Root Vault",
        description: "",
        filePath: "/vaults/vault.md", // not in a subfolder
        isListed: true,
      },
    ]

    expect(() => validateFolderConsistency(vaults, "/vaults")).not.toThrow()
  })

  it("allows any folder name (no predefined mapping)", () => {
    const vaults: ParsedVault[] = [
      {
        chainId: 42161,
        vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB",
        protocol: "morpho_v2",
        name: "Arbitrum Vault",
        description: "",
        filePath: "/vaults/arbitrum/vault.md",
        isListed: true,
      },
      {
        chainId: 747474,
        vaultAddress: "0xbeef0046fcab1dE47E41fB75BB3dC4Dfc94108E3",
        protocol: "morpho_v2",
        name: "Katana Vault",
        description: "",
        filePath: "/vaults/katana/vault.md",
        isListed: true,
      },
    ]

    // Any folder name should work as long as vaults are consistent
    expect(() => validateFolderConsistency(vaults, "/vaults")).not.toThrow()
  })
})
