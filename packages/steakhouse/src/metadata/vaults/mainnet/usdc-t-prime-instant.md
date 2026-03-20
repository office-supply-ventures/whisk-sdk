---
chainId: 1
vaultAddress: "0x6f48ce6380693808682e43140e3eeb877a096aa1"
protocol: morpho_v2
name: USDC T-Prime Instant
strategy: Prime
isListed: false
---

Allocating only to Morpho borrow/lend. Gated for whitelisted depositors by the smart contract [0x227ee4a33432733bd2fe14ba2162c81e6ada3249](https://etherscan.io/address/0x227ee4a33432733bd2fe14ba2162c81e6ada3249).

Prime Instant Repo vaults ([docs](https://www.steakhouse.financial/docs/products/vault-products/current/prime-instant)) maximizes exposure to repo markets on a blue-chip collateral only.

We target a rating in our [risk framework](https://www.steakhouse.financial/docs/risk-management) of AA or higher to mitigate solvency risks. The aggregated target maturity is less than one day.

Uses the Morpho adapter registry, and is therefore available on the Morpho frontend.
