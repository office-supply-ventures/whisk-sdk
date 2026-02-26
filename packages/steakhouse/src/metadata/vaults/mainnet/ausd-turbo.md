---

chainId: 1
vaultAddress: "0xBEEFFF7e4EedD83A4a4aB53A68D03eC77C9a57a8"
protocol: morpho_v2
name: AUSD Turbo
strategy: Turbo

---

****Agora Finance USD****

AUSD is a stablecoin issued by [Agora](https://www.agora.finance/product/ausd) with reserves custodied by State Street and managed by VanEck.

AUSD Turbo is a first-of-its kind noncustodial vault allowing AUSD holders to access term-locked strategies with a fixed maturity, through the Morpho v2 construct with our custom adapters.

****High Leverage****

Turbo vaults ([docs](https://www.steakhouse.financial/docs/products/vault-products/current/turbo)) target a 10% liquidity rate held in repo and the remainder programmatically allocated to a simple leverage strategy.

NAV accumulates when the cost of borrowing is persistently lower than the return on the underlying strategy. NAV decreases when the borrow cost is higher. The collateral selected fits our [risk framework](https://www.steakhouse.financial/docs/risk-management) to mitigate solvency risks.

Positions are intended to be held for an extended period (>30 days) to avoid slippage from swapping into positions from diluting the NAV.

Uses [Steakhouse Box](https://www.steakhouse.financial/docs/products/infrastructure/box-vaults) custom adapters to extend the noncustodial features of Morpho v2 vaults to additional strategies beyond borrow/lend. As this vault does not use the Morpho adapter registry, it is not available on the Morpho frontend.