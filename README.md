# @steakhouse/sdk

TypeScript SDK for Steakhouse-curated DeFi vaults, built on the Whisk GraphQL API.

## Installation

```bash
pnpm add @steakhouse/sdk
```

## Quick Start

```typescript
import { SteakhouseClient } from "@steakhouse/sdk"

const client = new SteakhouseClient({ apiKey: "your-api-key" })
const vaults = await client.getVaults()
```

## Exports

| Import                       | Purpose                              |
| ---------------------------- | ------------------------------------ |
| `@steakhouse/sdk`            | Core: SteakhouseClient, query functions |
| `@steakhouse/sdk/react`      | React hooks (TanStack Query)         |
| `@steakhouse/sdk/metadata`   | Chain/vault config and metadata      |

## Documentation

- [SDK Documentation](https://steakhouse-sdk.vercel.app/)
