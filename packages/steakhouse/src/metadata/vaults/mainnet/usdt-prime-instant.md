---
chainId: 1
vaultAddress: "0xbeef003c68896c7d2c3c60d363e8d71a49ab2bf9"
protocol: morpho_v2
name: USDT Prime Instant
strategy: Prime
---

Allocating only to Morpho borrow/lend.

Prime Instant Repo vaults ([docs](https://www.steakhouse.financial/docs/products/vault-products/current/prime-instant)) maximizes exposure to repo markets on a blue-chip collateral only.

We target a rating in our [risk framework](https://www.steakhouse.financial/docs/risk-management) of AA or higher to mitigate solvency risks. The aggregated target maturity is less than one day.

Uses the Morpho adapter registry, and is therefore available on the Morpho frontend.
