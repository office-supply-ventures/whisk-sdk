import { getStats } from "@whisk/steakhouse"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { steakhouseClient } from "../../lib/steakhouse"
import { TvlChart } from "./TvlChart"

function formatUsd(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  return `$${value.toLocaleString()}`
}

function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return value.toLocaleString()
}

const PROTOCOL_LABELS: Record<string, string> = {
  morpho_v1: "Morpho V1",
  morpho_v2: "Morpho V2",
  box: "Box",
  generic: "Generic",
}

export default async function StatsPage() {
  const stats = await getStats(steakhouseClient, { includeHistorical: true })

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-5xl space-y-8 px-6 py-12">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Steakhouse Stats</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Overview of Steakhouse vault activity and TVL
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardDescription>Total Value Locked</CardDescription>
              <CardTitle className="text-3xl">{formatUsd(stats.tvl.current.totalUsd)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Across {stats.tvl.current.byChain.length} chains and{" "}
                {stats.tvl.current.byProtocol.length} protocols
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Unique Depositors</CardDescription>
              <CardTitle className="text-3xl">
                {stats.uniqueDepositors != null ? formatNumber(stats.uniqueDepositors) : "N/A"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                All-time unique addresses across all vaults
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription>TVL by Chain</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.tvl.current.byChain.map((item) => (
                  <div key={item.chain.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.chain.name}</span>
                    <span className="font-mono font-medium">{formatUsd(item.tvlUsd)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>TVL by Protocol</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.tvl.current.byProtocol.map((item) => (
                  <div key={item.protocol} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {PROTOCOL_LABELS[item.protocol] ?? item.protocol}
                    </span>
                    <span className="font-mono font-medium">{formatUsd(item.tvlUsd)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>TVL by Asset Category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.tvl.current.byAssetCategory.map((item) => (
                  <div key={item.category ?? "other"} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.category ?? "Other"}</span>
                    <span className="font-mono font-medium">{formatUsd(item.tvlUsd)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Historical TVL</CardTitle>
            <CardDescription>Daily breakdown over the last year</CardDescription>
          </CardHeader>
          <CardContent>
            <TvlChart historical={stats.tvl.historical} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
