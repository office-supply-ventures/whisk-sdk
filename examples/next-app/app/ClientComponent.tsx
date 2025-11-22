"use client"

import { useVaultSummaries } from "@whisk/react"

export function ClientComponent() {
  const { data } = useVaultSummaries({ limit: 10 })

  return (
    <div>
      {" "}
      {data?.map((vault, i) => (
        <div key={vault?.vaultAddress ?? i}>{vault?.totalSupplied.raw ?? "missing"}</div>
      ))}
    </div>
  )
}
