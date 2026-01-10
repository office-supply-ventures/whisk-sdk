"use client"

import { useVaults } from "@whisk/steakhouse/react"

export function ClientComponent() {
  const { data } = useVaults({ limit: 10 })

  return (
    <div>
      {"VAL:"}
      {data?.map((vault, i) => (
        <div key={vault?.vaultAddress ?? i}>{vault?.totalSupplied.raw ?? "missing"}</div>
      ))}
    </div>
  )
}
