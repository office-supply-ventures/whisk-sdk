import * as fs from "node:fs"
import * as path from "node:path"
import type { VaultProtocol } from "@whisk/graphql"
import matter from "gray-matter"
import { getAddress, isAddress } from "viem"
import { z } from "zod"
import { VAULT_STRATEGIES } from "../src/metadata/types.js"

/** Vault protocol values - type-checked against GraphQL schema */
const VAULT_PROTOCOLS = [
  "generic",
  "morpho_v1",
  "morpho_v2",
  "box",
] as const satisfies readonly VaultProtocol[]

/**
 * Quote unquoted Ethereum addresses in YAML frontmatter.
 * YAML 1.1 parses 0x... as hex numbers, causing precision loss for addresses.
 */
function quoteAddresses(content: string): string {
  return content.replace(/^(\s*vaultAddress:\s*)(0x[a-fA-F0-9]+)\s*$/gm, '$1"$2"')
}

const VAULTS_DIR = path.join(import.meta.dirname, "../src/metadata/vaults")
const OUTPUT_FILE = path.join(import.meta.dirname, "../src/metadata/generated/vaults.ts")

/** Extract chain folder name from file path (e.g., "mainnet" from "vaults/mainnet/vault.md") */
export function getChainFolder(filePath: string, vaultsDir: string): string | null {
  const relativePath = path.relative(vaultsDir, filePath)
  const parts = relativePath.split(path.sep)
  return parts.length > 1 ? parts[0] : null
}

/** Zod schema for vault frontmatter validation */
export const VaultFrontmatterSchema = z.object({
  chainId: z.number().int().positive(),
  vaultAddress: z
    .string()
    .refine((addr) => isAddress(addr, { strict: false }), "Invalid Ethereum address")
    .transform((addr) => getAddress(addr)), // checksums the address
  protocol: z.enum(VAULT_PROTOCOLS),
  name: z.string().min(1).optional(),
  strategy: z.enum(VAULT_STRATEGIES).optional(),
  isListed: z.boolean().default(true),
})

type VaultFrontmatter = z.infer<typeof VaultFrontmatterSchema>

export interface ParsedVault extends VaultFrontmatter {
  description: string
  filePath: string
}

/** Parse vault markdown content (exported for testing) */
export function parseVaultContent(content: string, filePath: string): ParsedVault {
  const { data, content: description } = matter(quoteAddresses(content))

  const result = VaultFrontmatterSchema.safeParse(data)
  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n")
    throw new Error(`Invalid frontmatter in ${filePath}:\n${errors}`)
  }

  return {
    ...result.data,
    description: description.trim(),
    filePath,
  }
}

function parseVaultFile(filePath: string): ParsedVault {
  const content = fs.readFileSync(filePath, "utf-8")
  return parseVaultContent(content, filePath)
}

function findVaultFiles(dir: string): string[] {
  const files: string[] = []

  function walk(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)
      if (entry.isDirectory()) {
        walk(fullPath)
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        files.push(fullPath)
      }
    }
  }

  walk(dir)
  return files.sort()
}

/** Validate all vaults in same folder have consistent chainId (exported for testing) */
export function validateFolderConsistency(vaults: ParsedVault[], vaultsDir: string): void {
  // Group vaults by folder
  const folderVaults = new Map<string, ParsedVault[]>()
  for (const vault of vaults) {
    const folder = getChainFolder(vault.filePath, vaultsDir)
    if (!folder) continue
    const existing = folderVaults.get(folder) ?? []
    existing.push(vault)
    folderVaults.set(folder, existing)
  }

  // Check each folder has consistent chainId
  for (const [folder, vaultsInFolder] of folderVaults) {
    const chainIds = new Set(vaultsInFolder.map((v) => v.chainId))
    if (chainIds.size > 1) {
      const examples = vaultsInFolder
        .slice(0, 3)
        .map((v) => `  - ${path.basename(v.filePath)}: chainId ${v.chainId}`)
        .join("\n")
      throw new Error(
        `Inconsistent chainId in "${folder}/" folder:\n${examples}\n  All vaults in a folder must have the same chainId.`,
      )
    }
  }
}

/** Validate no duplicate chainId + address combinations (exported for testing) */
export function validateUniqueness(vaults: ParsedVault[]): void {
  const seen = new Map<string, string>()

  for (const vault of vaults) {
    const key = `${vault.chainId}:${vault.vaultAddress.toLowerCase()}`
    const existing = seen.get(key)
    if (existing) {
      throw new Error(
        `Duplicate vault found:\n  - ${existing}\n  - ${vault.filePath}\n  Both have chainId=${vault.chainId} and address=${vault.vaultAddress}`,
      )
    }
    seen.set(key, vault.filePath)
  }
}

/** Generate TypeScript code from parsed vaults (exported for testing) */
export function generateCode(vaults: ParsedVault[]): string {
  const vaultEntries = vaults
    .map((vault) => {
      const nameLine = vault.name ? `\n    name: ${JSON.stringify(vault.name)},` : ""
      const descriptionLine = vault.description
        ? `\n    description: ${JSON.stringify(vault.description)},`
        : ""
      const strategyLine = vault.strategy ? `\n    strategy: "${vault.strategy}",` : ""
      return `  {
    chainId: ${vault.chainId},
    address: "${vault.vaultAddress}",
    protocol: "${vault.protocol}",${nameLine}${descriptionLine}${strategyLine}
    isListed: ${vault.isListed},
  }`
    })
    .join(",\n")

  return `// THIS FILE IS AUTO-GENERATED. DO NOT EDIT DIRECTLY.
// Run \`pnpm generate:vaults\` to regenerate.

import type { VaultConfig } from "../types.js"

/** All Steakhouse vault configurations */
export const STEAKHOUSE_VAULTS: readonly VaultConfig[] = [
${vaultEntries},
] as const
`
}

function main() {
  console.log("Generating vault configurations...")

  // Find all vault files
  const vaultFiles = findVaultFiles(VAULTS_DIR)
  console.log(`Found ${vaultFiles.length} vault file(s)`)

  if (vaultFiles.length === 0) {
    console.warn("Warning: No vault files found")
  }

  // Parse all vaults
  const vaults: ParsedVault[] = []
  for (const filePath of vaultFiles) {
    try {
      const vault = parseVaultFile(filePath)
      vaults.push(vault)
      console.log(`  Parsed: ${path.relative(VAULTS_DIR, filePath)}`)
    } catch (error) {
      console.error(`Error parsing ${filePath}:`)
      throw error
    }
  }

  // Validate folder consistency and uniqueness
  validateFolderConsistency(vaults, VAULTS_DIR)
  validateUniqueness(vaults)

  // Generate code
  const code = generateCode(vaults)

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Write output
  fs.writeFileSync(OUTPUT_FILE, code)
  console.log(`Generated: ${path.relative(process.cwd(), OUTPUT_FILE)}`)
  console.log(`Total vaults: ${vaults.length}`)
}

// Only run main when executed directly (not when imported for testing)
const isMainModule = import.meta.url === `file://${process.argv[1]}`
if (isMainModule) {
  main()
}
