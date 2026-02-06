import { getTvl, getTvlHistorical } from "@whisk/steakhouse"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { steakhouseClient } from "../../lib/steakhouse"
import { TvlChart } from "./TvlChart"

function formatUsd(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  return `$${value.toLocaleString()}`
}

const PROTOCOL_LABELS: Record<string, string> = {
  morpho_v1: "Morpho V1",
  morpho_v2: "Morpho V2",
  box: "Box",
  generic: "Generic",
}

export default async function TvlPage() {
  const [tvl, historical] = await Promise.all([
    getTvl(steakhouseClient),
    getTvlHistorical(steakhouseClient),
  ])

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-5xl space-y-8 px-6 py-12">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Steakhouse TVL</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Total value locked across all Steakhouse vaults
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription>By Chain</CardDescription>
              <CardTitle className="text-2xl">{formatUsd(tvl.totalUsd)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tvl.byChain.map((item) => (
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
              <CardDescription>By Protocol</CardDescription>
              <CardTitle className="text-2xl">{formatUsd(tvl.totalUsd)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tvl.byProtocol.map((item) => (
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
              <CardDescription>By Asset Category</CardDescription>
              <CardTitle className="text-2xl">{formatUsd(tvl.totalUsd)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tvl.byAssetCategory.map((item) => (
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
            <TvlChart historical={historical} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
