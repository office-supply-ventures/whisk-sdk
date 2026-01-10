"use client"

import { useVaults } from "@whisk/steakhouse/react"

export function ClientComponent() {
  const { data, isLoading, error } = useVaults({ chainId: 1 })

  if (isLoading) return <div>Loading vaults...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h2>Steakhouse Vaults (Ethereum)</h2>
      {data?.map((vault) => (
        <div
          key={vault.vaultAddress}
          style={{ margin: "8px 0", padding: "8px", border: "1px solid #ccc" }}
        >
          <strong>{vault.name}</strong> ({vault.symbol})
          <br />
          TVL: ${vault.totalAssets.usd?.toLocaleString() ?? "N/A"}
          <br />
          APY: {vault.apy.total ? `${(vault.apy.total * 100).toFixed(2)}%` : "N/A"}
        </div>
      ))}
    </div>
  )
}
