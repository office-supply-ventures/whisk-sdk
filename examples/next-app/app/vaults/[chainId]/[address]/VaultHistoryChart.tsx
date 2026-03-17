"use client"

import type { SteakhouseVaultHistory } from "@steakhouse/sdk"
import { useMemo, useState } from "react"
import { Area, AreaChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type View = "tvl" | "apy"
type TvlUnit = "usd" | "underlying"
type ApyPeriod = "1d" | "7d" | "30d"

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

function formatFullDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

const usdCompact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
})

const amountCompact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
})

const percentFmt = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatUsd(value: number): string {
  return usdCompact.format(value)
}

function formatAmount(value: number): string {
  return amountCompact.format(value)
}

function formatPercent(value: number): string {
  return percentFmt.format(value)
}

function tooltipLabelFormatter(
  _: unknown,
  payload: Array<{ payload?: { timestamp?: number } }>,
): string {
  const ts = payload[0]?.payload?.timestamp
  if (!ts) return ""
  return formatFullDate(ts)
}

interface VaultHistoryChartProps {
  historical: SteakhouseVaultHistory
  assetSymbol: string
}

const tvlUsdConfig: ChartConfig = {
  value: {
    label: "Total Supplied (USD)",
    color: "#2470FF",
  },
}

const APY_PERIOD_CONFIG: Record<ApyPeriod, { dataKey: string; label: string; color: string }> = {
  "1d": { dataKey: "apy1d", label: "APY 1d", color: "#8B5CF6" },
  "7d": { dataKey: "apy7d", label: "APY 7d", color: "#2470FF" },
  "30d": { dataKey: "apy30d", label: "APY 30d", color: "#F59E0B" },
}

export function VaultHistoryChart({ historical, assetSymbol }: VaultHistoryChartProps) {
  const [view, setView] = useState<View>("tvl")
  const [tvlUnit, setTvlUnit] = useState<TvlUnit>("usd")
  const [apyPeriod, setApyPeriod] = useState<ApyPeriod>("7d")

  const daily = "daily" in historical ? historical.daily : null
  const weekly = "weekly" in historical ? historical.weekly : null

  const tvlData = useMemo(() => {
    const entries = (daily ?? weekly ?? []) as unknown as Array<{
      bucketTimestamp: number
      totalSupplied: { usd: number | null; formatted: string }
    }>
    return entries.map((entry) => ({
      timestamp: entry.bucketTimestamp,
      value:
        tvlUnit === "usd"
          ? (entry.totalSupplied.usd ?? Number(entry.totalSupplied.formatted))
          : Number(entry.totalSupplied.formatted),
    }))
  }, [daily, weekly, tvlUnit])

  const tvlChartConfig = useMemo<ChartConfig>(() => {
    if (tvlUnit === "usd") return tvlUsdConfig
    return {
      value: {
        label: `Total Supplied (${assetSymbol})`,
        color: "#2470FF",
      },
    }
  }, [tvlUnit, assetSymbol])

  const apyData = useMemo(() => {
    const entries = (daily ?? weekly ?? []) as unknown as Array<{
      bucketTimestamp: number
      supplyApy1d: { total: number } | null
      supplyApy7d: { total: number } | null
      supplyApy30d: { total: number } | null
    }>
    const key = APY_PERIOD_CONFIG[apyPeriod].dataKey
    return entries.map((entry) => {
      const src =
        apyPeriod === "1d"
          ? entry.supplyApy1d
          : apyPeriod === "7d"
            ? entry.supplyApy7d
            : entry.supplyApy30d
      return {
        timestamp: entry.bucketTimestamp,
        [key]: src?.total ?? null,
      }
    })
  }, [daily, weekly, apyPeriod])

  const apyChartConfig = useMemo<ChartConfig>(() => {
    const cfg = APY_PERIOD_CONFIG[apyPeriod]
    return { [cfg.dataKey]: { label: cfg.label, color: cfg.color } }
  }, [apyPeriod])

  const hasMorphoData = tvlData.length > 0

  const tvlFormatter = tvlUnit === "usd" ? formatUsd : formatAmount

  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        {hasMorphoData && (
          <>
            <Button
              variant={view === "tvl" ? "default" : "secondary"}
              size="sm"
              onClick={() => setView("tvl")}
            >
              TVL
            </Button>
            <Button
              variant={view === "apy" ? "default" : "secondary"}
              size="sm"
              onClick={() => setView("apy")}
            >
              APY
            </Button>
          </>
        )}

        {view === "tvl" && (
          <div className="ml-auto flex gap-1">
            <Button
              variant={tvlUnit === "usd" ? "default" : "outline"}
              size="sm"
              onClick={() => setTvlUnit("usd")}
            >
              USD
            </Button>
            <Button
              variant={tvlUnit === "underlying" ? "default" : "outline"}
              size="sm"
              onClick={() => setTvlUnit("underlying")}
            >
              {assetSymbol}
            </Button>
          </div>
        )}

        {view === "apy" && (
          <div className="ml-auto flex gap-1">
            {(["1d", "7d", "30d"] as const).map((p) => (
              <Button
                key={p}
                variant={apyPeriod === p ? "default" : "outline"}
                size="sm"
                onClick={() => setApyPeriod(p)}
              >
                {p}
              </Button>
            ))}
          </div>
        )}
      </div>

      {view === "tvl" && (
        <ChartContainer config={tvlChartConfig} className="min-h-[300px] w-full">
          <AreaChart accessibilityLayer data={tvlData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatDate}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={40}
            />
            <YAxis tickFormatter={tvlFormatter} tickLine={false} axisLine={false} width={70} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={tooltipLabelFormatter}
                  formatter={(value) => tvlFormatter(value as number)}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--color-value)"
              fill="var(--color-value)"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ChartContainer>
      )}

      {view === "apy" && (
        <ChartContainer config={apyChartConfig} className="min-h-[300px] w-full">
          <LineChart accessibilityLayer data={apyData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatDate}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={40}
            />
            <YAxis tickFormatter={formatPercent} tickLine={false} axisLine={false} width={60} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={tooltipLabelFormatter}
                  formatter={(value) => (value != null ? formatPercent(value as number) : "N/A")}
                />
              }
            />
            <Line
              type="monotone"
              dataKey={APY_PERIOD_CONFIG[apyPeriod].dataKey}
              stroke={`var(--color-${APY_PERIOD_CONFIG[apyPeriod].dataKey})`}
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          </LineChart>
        </ChartContainer>
      )}
    </div>
  )
}
