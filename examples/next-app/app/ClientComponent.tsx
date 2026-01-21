"use client"

import { useTvl } from "@whisk/steakhouse/react"

export function ClientComponent() {
  const { data, isLoading, error } = useTvl()

  if (isLoading) return <div>Loading TVL...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h2>Steakhouse TVL</h2>
      <p>
        <strong>Total:</strong> ${data?.totalUsd.toLocaleString()}
      </p>

      <h3>By Chain</h3>
      {data?.byChain.map((item) => (
        <div key={item.chain.id}>
          {item.chain.name}: ${item.tvlUsd.toLocaleString()}
        </div>
      ))}

      <h3>By Protocol</h3>
      {data?.byProtocol.map((item) => (
        <div key={item.protocol}>
          {item.protocol}: ${item.tvlUsd.toLocaleString()}
        </div>
      ))}

      <h3>By Asset Category</h3>
      {data?.byAssetCategory.map((item) => (
        <div key={item.category}>
          {item.category}: ${item.tvlUsd.toLocaleString()}
        </div>
      ))}
    </div>
  )
}
