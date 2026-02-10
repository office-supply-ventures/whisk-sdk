---
chainId: 8453
vaultAddress: "0xbeef00f0A818894a2Cf111644A5098421611100E"
protocol: morpho_v2
name: ETH Prime Instant
strategy: Prime
---

Allocating only to Morpho borrow/lend.

Prime Instant Repo vaults ([docs](https://www.steakhouse.financial/docs/products/vault-products/current/prime-instant)) maximizes exposure to repo markets on a blue-chip collateral only.

We target a rating in our [risk framework](https://www.steakhouse.financial/docs/risk-management) of AA or higher to mitigate solvency risks. The aggregated target maturity is less than one day.

Uses the Morpho adapter registry, and is therefore available on the Morpho frontend.
