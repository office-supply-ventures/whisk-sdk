"use client"

import type { SteakhouseVaultSummary } from "@steakhouse/sdk"
import Link from "next/link"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const usdFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
})

const percentFormat = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatUsd(value: number | null | undefined): string {
  if (value == null) return "N/A"
  return usdFormat.format(value)
}

function formatApy(value: number | null | undefined): string {
  if (value == null) return "N/A"
  return percentFormat.format(value)
}

const PROTOCOL_LABELS: Record<string, string> = {
  MorphoVault: "Morpho V1",
  MorphoVaultV2: "Morpho V2",
  BoxVault: "Box",
  GenericErc4626Vault: "Generic",
}

type SortKey =
  | "name"
  | "chain"
  | "asset"
  | "protocol"
  | "strategy"
  | "risk"
  | "tvl"
  | "apyInstant"
  | "apy1d"
  | "apy7d"
  | "apy30d"

type SortDir = "asc" | "desc"

function getSortValue(vault: SteakhouseVaultSummary, key: SortKey): string | number {
  switch (key) {
    case "name":
      return vault.name.toLowerCase()
    case "chain":
      return vault.chain.name.toLowerCase()
    case "asset":
      return vault.asset.symbol.toLowerCase()
    case "protocol":
      return (PROTOCOL_LABELS[vault.__typename] ?? vault.__typename).toLowerCase()
    case "strategy":
      return (vault.strategy ?? "").toLowerCase()
    case "risk":
      return vault.riskAssessment?.steakhouse?.score ?? -Infinity
    case "tvl":
      return vault.totalAssets.usd ?? 0
    case "apyInstant":
      return vault.apyInstant?.total ?? -Infinity
    case "apy1d":
      return vault.apy1d?.total ?? -Infinity
    case "apy7d":
      return vault.apy7d?.total ?? -Infinity
    case "apy30d":
      return vault.apy30d?.total ?? -Infinity
  }
}

function SortIndicator({ active, direction }: { active: boolean; direction: SortDir }) {
  if (!active) return <span className="text-muted-foreground/40 ml-1">{"↕"}</span>
  return <span className="ml-1">{direction === "asc" ? "↑" : "↓"}</span>
}

interface VaultsTableProps {
  vaults: SteakhouseVaultSummary[]
}

export function VaultsTable({ vaults }: VaultsTableProps) {
  const [showUnlisted, setShowUnlisted] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey>("tvl")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir(
        key === "name" ||
          key === "chain" ||
          key === "asset" ||
          key === "protocol" ||
          key === "strategy" ||
          key === "risk"
          ? "asc"
          : "desc",
      )
    }
  }

  const sorted = useMemo(() => {
    const list = showUnlisted ? vaults : vaults.filter((v) => v.isListed)
    return [...list].sort((a, b) => {
      const aVal = getSortValue(a, sortKey)
      const bVal = getSortValue(b, sortKey)
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      return sortDir === "asc" ? cmp : -cmp
    })
  }, [vaults, showUnlisted, sortKey, sortDir])

  const columns: { key: SortKey; label: string; align: "left" | "right" }[] = [
    { key: "name", label: "Vault", align: "left" },
    { key: "chain", label: "Chain", align: "left" },
    { key: "asset", label: "Asset", align: "left" },
    { key: "protocol", label: "Protocol", align: "left" },
    { key: "strategy", label: "Strategy", align: "left" },
    { key: "risk", label: "Risk", align: "left" },
    { key: "tvl", label: "TVL", align: "right" },
    { key: "apyInstant", label: "APY Instant", align: "right" },
    { key: "apy1d", label: "APY 1d", align: "right" },
    { key: "apy7d", label: "APY 7d", align: "right" },
    { key: "apy30d", label: "APY 30d", align: "right" },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>All Vaults</CardTitle>
            <CardDescription>
              {sorted.length} vault{sorted.length !== 1 ? "s" : ""}
            </CardDescription>
          </div>
          <Button
            variant={showUnlisted ? "default" : "secondary"}
            size="sm"
            onClick={() => setShowUnlisted((prev) => !prev)}
          >
            {showUnlisted ? "Hide Unlisted" : "Show Unlisted"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                {columns.map((col, i) => (
                  <th
                    key={col.key}
                    className={`cursor-pointer select-none pb-3 font-medium hover:opacity-70 ${
                      col.align === "right" ? "text-right" : ""
                    } ${i < columns.length - 1 ? "pr-4" : ""}`}
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label}
                    <SortIndicator active={sortKey === col.key} direction={sortDir} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((vault) => (
                <tr key={`${vault.chain.id}:${vault.address}`} className="border-b last:border-0">
                  <td className="py-3 pr-4">
                    <Link
                      href={`/vaults/${vault.chain.id}/${vault.address}`}
                      className="text-primary font-medium underline underline-offset-4 hover:opacity-80"
                    >
                      {vault.name}
                    </Link>
                    {!vault.isListed && (
                      <span className="text-muted-foreground ml-2 text-xs">(unlisted)</span>
                    )}
                  </td>
                  <td className="text-muted-foreground py-3 pr-4">{vault.chain.name}</td>
                  <td className="py-3 pr-4">
                    <span className="font-mono">{vault.asset.symbol}</span>
                  </td>
                  <td className="text-muted-foreground py-3 pr-4">
                    {PROTOCOL_LABELS[vault.__typename] ?? vault.__typename}
                  </td>
                  <td className="text-muted-foreground py-3 pr-4">{vault.strategy ?? "-"}</td>
                  <td className="text-muted-foreground py-3 pr-4">
                    {vault.riskAssessment?.steakhouse?.rating ?? "-"}
                  </td>
                  <td className="py-3 pr-4 text-right font-mono">
                    {formatUsd(vault.totalAssets.usd)}
                  </td>
                  <td className="py-3 pr-4 text-right font-mono">
                    {formatApy(vault.apyInstant?.total)}
                  </td>
                  <td className="py-3 pr-4 text-right font-mono">
                    {formatApy(vault.apy1d?.total)}
                  </td>
                  <td className="py-3 pr-4 text-right font-mono">
                    {formatApy(vault.apy7d?.total)}
                  </td>
                  <td className="py-3 text-right font-mono">{formatApy(vault.apy30d?.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
