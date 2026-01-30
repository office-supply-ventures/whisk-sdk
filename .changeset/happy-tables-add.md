---
"@whisk/steakhouse": patch
"@whisk/graphql": patch
---

Add comprehensive vault metadata system - Add 22 missing vaults from Morpho (Polygon, Monad, Base, Ethereum, Arbitrum) - Create polygon chain support (chainId 137) - Generate VAULTS.md summary with chain and asset breakdowns - Total: 92 vaults across 7 chains The vault list serves as the source of truth for SDK consumers, enabling apps to query the API for specific trusted vault addresses.
