---
chainId: 747474
vaultAddress: "0x1445a01a57d7b7663cfd7b4ee0a8ec03b379aabd"
protocol: morpho_v1
name: USDC High Yield Instant
strategy: High Yield
---

Allocating only to Morpho borrow/lend. Consider upgrading to a Steakhouse Morpho v2 vault for additional rewards, if available.

High Yield Instant Repo vaults ([docs](https://www.steakhouse.financial/docs/products/vault-products/current/high-yield-instant)) maximizes exposure to repo markets on a wide range of collateral.

We target a rating in our [risk framework](https://www.steakhouse.financial/docs/risk-management) of CC or higher to mitigate solvency risks. The aggregated target maturity is less than one day with concentration limits on risk-tiers for underlying collateral.

Uses the Morpho adapter registry, and is therefore available on the Morpho frontend.
