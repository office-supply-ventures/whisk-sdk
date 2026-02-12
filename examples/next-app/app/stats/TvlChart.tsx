"use client"

import type { GetStatsResultWithHistorical } from "@whisk/steakhouse"
import { useMemo, useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type Breakdown = "chain" | "protocol" | "assetCategory"

const CHAIN_COLORS: Record<string, string> = {
  Ethereum: "#627EEA",
  Base: "#0052FF",
  Polygon: "#8247E5",
  Arbitrum: "#28A0F0",
  Optimism: "#FF0420",
  Gnosis: "#04795B",
}

const PROTOCOL_COLORS: Record<string, string> = {
  morpho_v1: "#2470FF",
  morpho_v2: "#1a5ccc",
  box: "#6C5CE7",
  generic: "#94a3b8",
}

const CATEGORY_COLORS: Record<string, string> = {
  Stable: "#22C55E",
  Eth: "#627EEA",
  Btc: "#F7931A",
  Other: "#94a3b8",
}

const PROTOCOL_LABELS: Record<string, string> = {
  morpho_v1: "Morpho V1",
  morpho_v2: "Morpho V2",
  box: "Box",
  generic: "Generic",
}

function getColor(breakdown: Breakdown, key: string, index: number): string {
  const fallback = `hsl(${index * 47 + 200}, 65%, 55%)`
  if (breakdown === "chain") return CHAIN_COLORS[key] ?? fallback
  if (breakdown === "protocol") return PROTOCOL_COLORS[key] ?? fallback
  return CATEGORY_COLORS[key] ?? fallback
}

function getLabel(breakdown: Breakdown, key: string): string {
  if (breakdown === "protocol") return PROTOCOL_LABELS[key] ?? key
  return key
}

function formatUsd(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value.toFixed(0)}`
}

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

type TvlHistorical = GetStatsResultWithHistorical["tvl"]["historical"]

interface TvlChartProps {
  historical: TvlHistorical
}

export function TvlChart({ historical }: TvlChartProps) {
  const [breakdown, setBreakdown] = useState<Breakdown>("chain")

  const keys = useMemo(() => getKeysForBreakdown(historical, breakdown), [historical, breakdown])

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {}
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      config[key] = {
        label: getLabel(breakdown, key),
        color: getColor(breakdown, key, i),
      }
    }
    return config
  }, [keys, breakdown])

  const chartData = useMemo(
    () =>
      historical.map((snapshot) => {
        const point: Record<string, number> = { timestamp: snapshot.timestamp }
        if (breakdown === "chain") {
          for (const item of snapshot.byChain) {
            point[item.chain.name] = item.tvlUsd
          }
        } else if (breakdown === "protocol") {
          for (const item of snapshot.byProtocol) {
            point[item.protocol] = item.tvlUsd
          }
        } else {
          for (const item of snapshot.byAssetCategory) {
            point[item.category ?? "Other"] = item.tvlUsd
          }
        }
        return point
      }),
    [historical, breakdown],
  )

  return (
    <div>
      <div className="mb-6 flex gap-2">
        {(["chain", "protocol", "assetCategory"] as const).map((b) => (
          <Button
            key={b}
            variant={breakdown === b ? "default" : "secondary"}
            size="sm"
            onClick={() => setBreakdown(b)}
          >
            {b === "assetCategory" ? "Asset Category" : b.charAt(0).toUpperCase() + b.slice(1)}
          </Button>
        ))}
      </div>

      <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
        <AreaChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatDate}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={40}
          />
          <YAxis tickFormatter={formatUsd} tickLine={false} axisLine={false} width={70} />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(_, payload) => {
                  const ts = payload[0]?.payload?.timestamp as number | undefined
                  if (!ts) return ""
                  return new Date(ts * 1000).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                }}
                formatter={(value, name) => {
                  const label = chartConfig[name as string]?.label ?? String(name)
                  return (
                    <div className="flex w-full items-center justify-between gap-4">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-mono font-medium tabular-nums">
                        {formatUsd(value as number)}
                      </span>
                    </div>
                  )
                }}
                indicator="dot"
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
          {keys.map((key) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stackId="1"
              stroke={`var(--color-${key})`}
              fill={`var(--color-${key})`}
              fillOpacity={0.4}
            />
          ))}
        </AreaChart>
      </ChartContainer>
    </div>
  )
}

function getKeysForBreakdown(historical: TvlHistorical, breakdown: Breakdown): string[] {
  const keySet = new Set<string>()
  for (const snapshot of historical) {
    if (breakdown === "chain") {
      for (const item of snapshot.byChain) keySet.add(item.chain.name)
    } else if (breakdown === "protocol") {
      for (const item of snapshot.byProtocol) keySet.add(item.protocol)
    } else {
      for (const item of snapshot.byAssetCategory) keySet.add(item.category ?? "Other")
    }
  }
  return Array.from(keySet)
}
