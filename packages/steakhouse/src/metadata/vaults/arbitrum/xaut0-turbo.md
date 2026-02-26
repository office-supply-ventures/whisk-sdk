---
chainId: 42161
vaultAddress: "0xBEEFFFFE0E9b26bBe3B5cE851539366991C3BF39"
protocol: morpho_v2
name: XAUT0 Turbo
strategy: Turbo
isListed: false
---

**Carry involves leverage**

Carry vaults ([docs](https://www.steakhouse.financial/docs/products/vault-products/current/turbo)) involve borrowing against one collateral type to earn a higher yield in the loan asset.

NAV accumulates when the cost of borrowing is persistently lower than the return on the underlying strategy. NAV decreases when the borrow cost is higher. The collateral selected fits our [risk framework](https://www.steakhouse.financial/docs/risk-management) to mitigate solvency risks.

Positions are intended to be held for an extended period (>30 days) to avoid slippage from swapping into positions from diluting the NAV.

Uses [Steakhouse Box](https://www.steakhouse.financial/docs/products/infrastructure/box-vaults) custom adapters to extend the noncustodial features of Morpho v2 vaults to additional strategies beyond borrow/lend. As this vault does not use the Morpho adapter registry, it is not available on the Morpho frontend.
