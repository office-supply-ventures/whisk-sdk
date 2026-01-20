# Vault Metadata

Steakhouse vault metadata is defined in markdown files with YAML frontmatter, which are compiled into TypeScript at build time.

## Adding a New Vault

1. Create a `.md` file in `vaults/{chain}/`:

   ```
   vaults/mainnet/my-vault.md
   vaults/base/my-vault.md
   ```

2. Add YAML frontmatter:

   ```yaml
   ---
   chainId: 1
   vaultAddress: 0x...
   protocol: morpho_v2
   type: Prime
   ---
   ```

   Optionally override the on-chain name or add a description:

   ```yaml
   ---
   chainId: 1
   vaultAddress: 0x...
   protocol: morpho_v2
   type: Prime
   name: Custom Display Name
   ---

   Custom description in markdown. Supports **formatting**, links, etc.
   ```

3. Regenerate and commit:

   ```bash
   pnpm generate:vaults
   git add src/metadata/generated/vaults.ts
   ```

4. Verify the vault appears in `generated/vaults.ts` and commit the changes

## Frontmatter Fields

| Field          | Required | Description                                       |
| -------------- | -------- | ------------------------------------------------- |
| `chainId`      | Yes      | Chain ID (1 for mainnet, 8453 for Base, etc.)     |
| `vaultAddress` | Yes      | Ethereum address, no quotes needed (checksummed automatically) |
| `protocol`     | Yes      | `morpho_v1`, `morpho_v2`, `generic`, or `box`     |
| `type`         | No       | `Prime`, `High Yield`, `Turbo`, or `Term`         |
| `name`         | No       | Override display name (defaults to on-chain name) |

The markdown body after the frontmatter becomes the `description` field (optional, defaults to morpho metadata).

## Validation

The build script validates:

- Required fields are present
- Valid Ethereum address format (checksummed automatically via viem)
- Valid protocol enum value (from `@whisk/graphql`)
- Valid type enum value (if provided)
- No duplicate chainId + vaultAddress combinations

If validation fails, the build will error with details about which file and field failed.

## File Naming

Use descriptive slugs that identify the vault:

```
vaults/
  mainnet/
    steakhouse-usdc.md
    steakhouse-eth.md
  base/
    steakhouse-usdc.md
```

The filename doesn't affect the generated code - it's just for organization.

## Generated Output

The generator creates `src/metadata/generated/vaults.ts` with:

- `STEAKHOUSE_VAULTS` - array of all vault configurations

This file is committed to git for security auditability. CI verifies the committed file matches regenerated output.
