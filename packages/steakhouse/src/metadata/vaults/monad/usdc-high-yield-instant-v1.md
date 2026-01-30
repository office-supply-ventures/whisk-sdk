---
chainId: 143
vaultAddress: "0x802c91d807A8DaCA257c4708ab264B6520964e44"
protocol: morpho_v1
name: (v1) USDC High Yield Instant
strategy: High Yield
---

Allocating only to Morpho borrow/lend. Consider upgrading to a Steakhouse Morpho v2 vault for additional rewards, if available.

High Yield Instant Repo vaults ([docs](https://www.steakhouse.financial/docs/products/vault-products/current/high-yield-instant)) maximizes exposure to repo markets on a wide range of collateral.

We target a rating in our [risk framework](https://www.steakhouse.financial/docs/risk-management) of CC or higher to mitigate solvency risks. The aggregated target maturity is less than one day with concentration limits on risk-tiers for underlying collateral.

Uses the Morpho adapter registry, and is therefore available on the Morpho frontend.
