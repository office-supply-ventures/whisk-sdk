---
chainId: 1
vaultAddress: "0xbeefffc57a26fd8d3b693ba025ead597dbecebfe"
protocol: morpho_v2
name: USDC High Yield Term
strategy: Term
---

**Term-locked strategy**

Term vaults ([docs](https://www.steakhouse.financial/docs/products/vault-products/current/term)) target a 10% liquidity rate held in repo and the remainder programmatically allocated to a simple buy-and-hold strategy of collateral assets with a fixed maturity.

Term collateral includes, for example, Pendle PT tokens held to maturity. The collateral selected fits our [risk framework](https://www.steakhouse.financial/docs/risk-management) to mitigate solvency risks.

Positions are intended to be held for an extended period (>30 days) to avoid slippage from swapping into positions from diluting the NAV.

Uses [Steakhouse Box](https://www.steakhouse.financial/docs/products/infrastructure/box-vaults) custom adapters to extend the noncustodial features of Morpho v2 vaults to additional strategies beyond borrow/lend. As this vault does not use the Morpho adapter registry, it is not available on the Morpho frontend.
