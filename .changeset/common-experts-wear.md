---
"@whisk/steakhouse": minor
"@whisk/graphql": patch
---

Restructure TVL queries around snapshot model and add historical TVL

**Breaking changes:**
  - **`getTvl` return type changed**: Now returns `SteakhouseTvlSnapshot` instead of `SteakhouseTvl`. The shape is similar but includes `timestamp`
  instead of `computedAt`.
  - **`useTvl` hook removed**: Use `getTvl` directly with server-side fetching instead.
  - **`category` is now nullable in `byAssetCategory`**: `TokenCategory | null` instead of `TokenCategory`. A `null` category represents uncategorized
  assets.
  - **`tvlQuery` is no longer exported**: The GraphQL document is now a private module detail.

  **New features:**
  - **`getTvlHistorical`**: Fetch daily TVL snapshots for the last 365 days, ordered oldest-first.
