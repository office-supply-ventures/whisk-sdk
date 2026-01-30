---
chainId: 42161
vaultAddress: "0xbeeff77ce5c059445714e6a3490e273fe7f2492f"
protocol: morpho_v2
name: USDT0 High Yield Instant
strategy: High Yield
---

Allocating only to Morpho borrow/lend.

High Yield Instant Repo vaults ([docs](https://www.steakhouse.financial/docs/products/vault-products/current/high-yield-instant)) maximizes exposure to repo markets on a wide range of collateral.

We target a rating in our [risk framework](https://www.steakhouse.financial/docs/risk-management) of CC or higher to mitigate solvency risks. The aggregated target maturity is less than one day with concentration limits on risk-tiers for underlying collateral.

Uses the Morpho adapter registry, and is therefore available on the Morpho frontend.
