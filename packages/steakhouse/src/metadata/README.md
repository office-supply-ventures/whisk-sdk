# Vault Metadata

This folder contains the official list of Steakhouse vaults. Each vault is defined in a simple markdown file with the vault's details.

This guide explains how to add a new vault.

## Quick Start

1. Create a new `.md` file in the appropriate chain folder (e.g., `vaults/mainnet/`)
2. Define the vault using yaml frontmatter and markdown
3. Run `pnpm generate:vaults` to generate the vault registry
4. Run `pnpm vitest vault-verification` to verify the vault onchain
5. Run `pnpm changeset` to prepare for publishing
6. Commit and open a PR

## Before You Begin

You'll need:

- The vault's contract address
- Which blockchain the vault is on
- The vault protocol version (`morpho_v1` or `morpho_v2`)

## Supported Chains

Vaults must be placed in the folder that corresponds to their deployment chain.

| Chain    | chainId | Folder      |
| -------- | ------- | ----------- |
| Ethereum | 1       | `mainnet/`  |
| Base     | 8453    | `base/`     |
| Arbitrum | 42161   | `arbitrum/` |
| Polygon  | 137     | `polygon/`  |
| Monad    | 143     | `monad/`    |
| Katana   | 747474  | `katana/`   |
| Unichain | 130     | `unichain/` |

### Adding a New Chain

To support a new blockchain:

1. Create a folder in `vaults/` (e.g., `vaults/newchain/`)
2. Add the chain name to `chainNames` in `scripts/generate-vaults.ts`
3. Add the chain config to `chainConfigs` in `vault-verification.test.ts` (import from `viem/chains`)
4. Update the Supported Chains table above

## Adding a New Vault

### Step 1: Create the file

Create a new file in `vaults/{chain}/` with a descriptive name:

```
{asset}-{strategy}-{name}-{version}.md
```

- **asset** (required): The token symbol in lowercase — `usdc`, `eth`, `wbtc`
- **strategy** (optional): The vault strategy — `prime`, `high-yield`, `turbo`, `term`
- **name** (optional): Partner or variant name — `instant`, `grove`, `safe`
- **version** (optional): Version number if multiple exist — `v1`, `v2`

**Examples:**

| File name                  | Description                |
| -------------------------- | -------------------------- |
| `usdc-prime.md`            | Basic USDC Prime vault     |
| `usdc-prime-instant.md`    | USDC Prime Instant variant |
| `usdc-prime-instant-v1.md` | Version 1 of the above     |
| `eth-turbo.md`             | ETH Turbo vault            |
| `usdc-high-yield-grove.md` | USDC High Yield for Grove  |

### Step 2: Add the vault details

Open the file and paste this template:

```yaml
---
chainId: 1
vaultAddress: "0x..."
protocol: morpho_v1
strategy: Prime
---
```

The section between `---` markers is called **frontmatter** — it contains the vault configuration. See [Field Reference](#field-reference) for all options.

**Example with all fields:**

```yaml
---
chainId: 1
vaultAddress: "0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB"
protocol: morpho_v1
strategy: Prime
name: USDC Prime Instant
isListed: false
---
Optional description goes here. You can use any markdown formatting.

This text appears as the vault description in the app.
```

### Step 3: Generate the registry

Run this command to update the vault registry:

```bash
pnpm generate:vaults
```

This creates two files in `generated/`:

- **vaults.ts** — The code used by the app
- **VAULTS.md** — A summary table of all vaults

**Review [`generated/VAULTS.md`](./generated/VAULTS.md)** to verify your vault appears correctly with the right name, strategy, and listed status.

### Step 4: Run onchain validation

Run the onchain validation to verify the vault exists onchain and has the correct curator:

```bash
pnpm vitest vault-verification
```

This checks that:

- The vault was deployed from a Morpho factory
- The vault has the Steakhouse curator

> Note this is also run in CI, so you will not be able to merge unless this passes

### Step 5: Create a changeset

Run this command to prepare your change for publishing:

```bash
pnpm changeset
```

When prompted:

1. Select `@whisk/steakhouse` using spacebar
2. Choose "patch" (for adding/updating vaults)
3. Write a short description like "Add USDC Prime vault"

### Step 6: Commit and open a PR

```bash
git add .
git commit -m "feat: add USDC Prime vault"
git push
```

Then open a pull request for review.

## Field Reference

| Field          | Required | Description                                                     |
| -------------- | -------- | --------------------------------------------------------------- |
| `chainId`      | Yes      | The chain ID number (see [Supported Chains](#supported-chains)) |
| `vaultAddress` | Yes      | The vault's contract address (starts with `0x`)                 |
| `protocol`     | Yes      | Either `morpho_v1` or `morpho_v2`                               |
| `strategy`     | No       | `Prime`, `High Yield`, `Turbo`, or `Term`                       |
| `name`         | No       | Custom display name (otherwise uses the onchain name)           |
| `isListed`     | No       | Set to `false` to hide from public listings                     |

**About `isListed`:** Vaults with `isListed: false` won't appear in public vault listings but still exist in the registry. Use this for:

- Partner-specific vaults
- Deprecated vaults
- Vaults not yet ready for public use

## Folder Structure

```
vaults/
  mainnet/
    usdc-prime.md
    usdc-prime-instant-v1.md
    usdc-high-yield-grove.md
    eth-turbo.md
  base/
    usdc-high-yield.md
    eth-prime-instant.md
  arbitrum/
    usdc-turbo.md
```

## Generation Checks

The generator (`pnpm generate:vaults`) checks for common mistakes:

- Missing required fields
- Invalid contract addresses
- Invalid protocol or strategy values
- Duplicate vaults (same chain + address)
- Mismatched chain IDs within a folder

If something is wrong, you'll see an error message pointing to the file and field. See [Troubleshooting](#troubleshooting) for how to fix common errors.

## Onchain Validation

The onchain validation (`vault-verification.test.ts`) verifies that all vaults are valid onchain. This runs in CI and is recommended to run manually before submitting a PR (see [Step 4](#step-4-run-onchain-validation)).

### What the tests check

1. **Factory verification** — Every vault must be deployed from a Morpho factory (v1.0, v1.1, or v2)
2. **Curator verification** — Every vault must have the Steakhouse curator (`0x827e86072B06674a077f592A531dcE4590aDeCdB`)

### If a test fails

- **Factory check fails** — The vault address may be incorrect, or it's a non-Morpho vault
- **Curator check fails** — The vault may be a partnership vault with a different curator. Add it to the `CURATOR_CHECK_EXCLUSIONS` list in `vault-verification.test.ts`

## Troubleshooting

**"Duplicate vault" error**
Another file already has the same `chainId` + `vaultAddress` combination. Search for the address to find the other file.

**"Invalid Ethereum address" error**
Check that the address starts with `0x` and is 42 characters long. The generator will automatically fix the checksum.

**"Inconsistent chainId" error**
All files in the same folder must have the same `chainId`. Check that you didn't accidentally put a file in the wrong chain folder.

**"Invalid frontmatter" error**
The error message will show which field is invalid:

- `chainId`: Must be a positive number (e.g., `1`, not `"1"`)
- `vaultAddress`: Must be a valid Ethereum address
- `protocol`: Must be exactly `morpho_v1` or `morpho_v2`
- `strategy`: Must be exactly `Prime`, `High Yield`, `Turbo`, or `Term`
- `isListed`: Must be `true` or `false` (not quoted)

**Vault not appearing after generation**

1. Make sure the file is in the correct `vaults/{chain}/` folder
2. Make sure the file ends with `.md`
3. Check that frontmatter has the opening and closing `---` markers
4. Look for error messages when running `pnpm generate:vaults`
