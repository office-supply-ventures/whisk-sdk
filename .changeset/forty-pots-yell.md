---
"@whisk/steakhouse": minor
"@whisk/graphql": patch
---

Features:

- Added getStats function including uniqueDeposits and tvl

Breaking Changes:

- `getTvl` replaced by `getStats`

```diff
- const tvl = await getTvl(client)
+ const stats = await getStats(client)
+ const tvl = stats.tvl.current
```

- `getTvlHistorical` replaced by `getStats`

```diff
- const snapshots = await getTvlHistorical(client)
+ const stats = await getStats(client, { includeHistorical: true })
+ const snapshots = stats.tvl.historical;
```
