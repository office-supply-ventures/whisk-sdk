# Steakhouse SDK

TypeScript SDK for Steakhouse-curated DeFi vaults, built on the Whisk GraphQL API.

## Architecture

```
@whisk/graphql → @whisk/client → @steakhouse/sdk
```

- **@whisk/graphql** - GraphQL schema, gql.tada setup, typed queries (npm dependency)
- **@whisk/client** - Core WhiskClient with URQL, scalar handling, error types (npm dependency)
- **@steakhouse/sdk** - Steakhouse vault integration with React hooks and metadata (this repo)

## Package Structure

```
packages/
└── steakhouse/       # @steakhouse/sdk
    ├── src/
    │   ├── index.ts           # Core: SteakhouseClient, queries
    │   ├── queries/           # Query functions (getVaults, etc.)
    │   ├── react/             # React hooks and provider
    │   └── metadata/          # Chain/vault configs
    └── Subpath exports:
        - @steakhouse/sdk
        - @steakhouse/sdk/react
        - @steakhouse/sdk/metadata
```

## Commands

```bash
pnpm build           # Build all packages (turbo)
pnpm check:types     # TypeScript type check
pnpm test            # Run vitest tests
pnpm check           # Biome lint/format (auto-fix)
pnpm dev:next        # Run Next.js example app
pnpm clean           # Clean all build artifacts
```

## Development

### Adding a new query to @steakhouse/sdk

1. Create fragment in `src/queries/fragments/` if needed
2. Create query file in `src/queries/` following `getVaults.ts` pattern
3. Export from `src/queries/index.ts`
4. Optionally create React hook in `src/react/hooks/`

### Query function pattern

```typescript
import { graphql, type ResultOf } from "@whisk/graphql"
import type { VariablesOf } from "gql.tada"
import type { SteakhouseClient } from "../client.js"

export const myQuery = graphql(`query MyQuery($arg: String!) { ... }`)

export type MyQueryVariables = VariablesOf<typeof myQuery>
export type MyQueryResult = ResultOf<typeof myQuery>["fieldName"]

export async function getMyData(
  client: SteakhouseClient,
  variables: MyQueryVariables,
): Promise<MyQueryResult> {
  const result = await client.query(myQuery, variables)
  return result.fieldName
}
```

### React hook pattern

```typescript
"use client"

import { type GetMyDataVariables, getMyData } from "../../queries/getMyData.js"
import { useSteakhouseQuery } from "./useSteakhouseQuery.js"

export function useMyData(variables: GetMyDataVariables) {
  return useSteakhouseQuery({
    queryName: "myData",
    queryFn: getMyData,
    variables,
  })
}
```

## Conventions

- Use `function` keyword for top-level functions (not arrow functions)
- Explicit return types on exported functions
- Use `.js` extensions in imports (ES modules)
- React components use explicit `Props` interface
- No `try/catch` unless necessary - let errors propagate
- Tests use mocked data (no real API calls in CI)

## Tooling

- **pnpm** - Package manager (workspaces)
- **turbo** - Build orchestration
- **tsup** - TypeScript bundler
- **gql.tada** - Type-safe GraphQL queries
- **URQL** - GraphQL client
- **TanStack Query** - React data fetching
- **Biome** - Linting and formatting
- **Vitest** - Testing
- **Changesets** - Version management

## Releasing

Always use `pnpm changeset` (interactive CLI) to create changesets — never create changeset files manually.

```bash
pnpm changeset              # Create changeset describing your changes (interactive)
pnpm changeset:version      # Bump versions and update changelogs
git add -A && git commit    # Commit the version bumps
```

After merging to `main`, CI automatically runs `changeset:publish` to build and publish to npm (see `.github/workflows/main.yml`).

## Environment Variables

For the Next.js example app:

```bash
NEXT_PUBLIC_WHISK_API_KEY=xxx
NEXT_PUBLIC_WHISK_API_URL=https://staging.api-v2.whisk.so/graphql
```
