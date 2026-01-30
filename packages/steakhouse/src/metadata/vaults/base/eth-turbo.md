---
chainId: 8453
vaultAddress: "0xbeefffdeadc2c172130ac4c5ae48c8d4708bfb40"
protocol: morpho_v2
name: ETH Turbo
strategy: Turbo
---

**High Leverage**

Turbo vaults ([docs](https://www.steakhouse.financial/docs/products/vault-products/current/turbo)) target a 10% liquidity rate held in repo and the remainder programmatically allocated to a simple leverage strategy.

NAV accumulates when the cost of borrowing is persistently lower than the return on the underlying strategy. NAV decreases when the borrow cost is higher. The collateral selected fits our [risk framework](https://www.steakhouse.financial/docs/risk-management) to mitigate solvency risks.

Positions are intended to be held for an extended period (>30 days) to avoid slippage from swapping into positions from diluting the NAV.

Uses [Steakhouse Box](https://www.steakhouse.financial/docs/products/infrastructure/box-vaults) custom adapters to extend the noncustodial features of Morpho v2 vaults to additional strategies beyond borrow/lend. As this vault does not use the Morpho adapter registry, it is not available on the Morpho frontend.
