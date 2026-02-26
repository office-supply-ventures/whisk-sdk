---

chainId: 1
vaultAddress: "0xBEEFF0DeaC1aBa71EF0D88C4291354eb92ef4589"
protocol: morpho_v2
name: AUSD High Yield Term
strategy: Term

---

****Agora Finance USD****

AUSD is a stablecoin issued by [Agora](https://www.agora.finance/product/ausd) with reserves custodied by State Street and managed by VanEck.

AUSD Term is a first-of-its kind noncustodial vault allowing AUSD holders to access term-locked strategies with a fixed maturity, through the Morpho v2 construct with our custom adapters.

****Term-locked strategy****

Term vaults ([docs](https://www.steakhouse.financial/docs/products/vault-products/current/term)) target a 10% liquidity rate held in repo and the remainder programmatically allocated to a simple buy-and-hold strategy of collateral assets with a fixed maturity, such as PT rolling strategies.

Term collateral includes, for example, Pendle PT tokens held to maturity. The collateral selected fits our [risk framework](https://www.steakhouse.financial/docs/risk-management) to mitigate solvency risks.

Positions are intended to be held for an extended period (>30 days) to avoid slippage from swapping into positions from diluting the NAV.

Uses [Steakhouse Box](https://www.steakhouse.financial/docs/products/infrastructure/box-vaults) custom adapters to extend the noncustodial features of Morpho v2 vaults to additional strategies beyond borrow/lend. As this vault does not use the Morpho adapter registry, it is not available on the Morpho frontend.