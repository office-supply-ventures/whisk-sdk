# Whisk SDK

TypeScript SDK for interacting with the Whisk GraphQL API, focused on DeFi vault integrations.

## Architecture

```
@whisk/graphql → @whisk/client
```

- **@whisk/graphql** - GraphQL schema, gql.tada setup, typed queries
- **@whisk/client** - Core WhiskClient with URQL, scalar handling, error types

## Package Structure

```
packages/
├── graphql/          # GraphQL schema and gql.tada codegen
└── client/           # Core WhiskClient (URQL-based)
```

## Commands

```bash
pnpm build           # Build all packages (turbo)
pnpm check:types     # TypeScript type check
pnpm check:graphql   # Validate queries against schema (gql.tada check)
pnpm test            # Run vitest tests
pnpm check           # Biome lint/format (auto-fix)
pnpm dev:docs        # Run the docs site
pnpm clean           # Clean all build artifacts
```

## Development

### Updating the GraphQL schema

The schema is committed and not fetched during build (for security). Generated files live in `packages/graphql/src/generated/`:

- `schema.json` - Minified introspection for runtime (urql scalar exchange)
- `schema.graphql` - SDL for gql.tada type inference
- `graphql-env.d.ts` - Generated TypeScript types from gql.tada

When the Whisk API schema changes:

```bash
pnpm schema:sync          # Fetch from staging (default)
pnpm schema:sync:local    # Fetch from local API (http://localhost:3500/graphql)
```

This fetches the introspection, generates `schema.json` + `schema.graphql`, and regenerates `graphql-env.d.ts` in a single pass. Review the diff, commit, and push.

### Local development across repos

When developing the SDK alongside a local Whisk API and a consuming app:

```
Terminal 1:  whisk-api   → Run local API on localhost:3500
Terminal 2:  whisk-sdk   → pnpm dev (tsup --watch, rebuilds on file changes)
Terminal 3:  app         → pnpm dev (picks up SDK changes via symlink)
```

**1. Sync schema from local API** (only needed when API schema changes):

```bash
pnpm schema:sync:local
```

**2. Link SDK into the app** using pnpm overrides in the app's `package.json`:

```jsonc
"pnpm": {
  "overrides": {
    "@whisk/graphql": "link:../whisk-sdk/packages/graphql",
    "@whisk/client": "link:../whisk-sdk/packages/client"
  }
}
```

Then run `pnpm install` in the app. Adjust the `link:` paths based on your directory layout. Remember to remove overrides before committing in the app repo.

**3. Point the app at local API** via environment variable:

```bash
NEXT_PUBLIC_WHISK_API_URL=http://localhost:3500/graphql
```

## Conventions

- Use `function` keyword for top-level functions (not arrow functions)
- Explicit return types on exported functions
- Use `.js` extensions in imports (ES modules)
- No `try/catch` unless necessary - let errors propagate
- Tests use mocked data (no real API calls in CI)

## Tooling

- **pnpm** - Package manager (workspaces)
- **turbo** - Build orchestration
- **tsup** - TypeScript bundler
- **gql.tada** - Type-safe GraphQL queries
- **URQL** - GraphQL client
- **Biome** - Linting and formatting
- **Vitest** - Testing
- **Changesets** - Version management

## Releasing

Always use `pnpm changeset` (interactive CLI) to create changesets, never create changeset files manually.

```bash
pnpm changeset              # Create changeset describing your changes (interactive)
pnpm changeset:version      # Bump versions and update changelogs
git add -A && git commit    # Commit the version bumps
```

After merging to `main`, CI automatically runs `changeset:publish` to build and publish to npm (see `.github/workflows/main.yml`).

## Environment Variables

For consuming apps:

```bash
NEXT_PUBLIC_WHISK_API_KEY=xxx
NEXT_PUBLIC_WHISK_API_URL=https://staging.api-v2.whisk.so/graphql
```
