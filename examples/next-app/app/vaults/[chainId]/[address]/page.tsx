import { getVault, getVaultHistory } from "@whisk/steakhouse"
import Link from "next/link"
import Markdown from "react-markdown"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { steakhouseClient } from "../../../../lib/steakhouse"
import { VaultHistoryChart } from "./VaultHistoryChart"

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

const amountFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 4,
})

const leverageFormat = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatAmount(value: string | null | undefined): string {
  if (value == null) return "N/A"
  const num = Number(value)
  if (Number.isNaN(num)) return value
  return amountFormat.format(num)
}

const PROTOCOL_LABELS: Record<string, string> = {
  MorphoVault: "Morpho V1",
  MorphoVaultV2: "Morpho V2",
  BoxVault: "Box",
  GenericErc4626Vault: "Generic",
}

interface VaultPageProps {
  params: Promise<{
    chainId: string
    address: string
  }>
  searchParams: Promise<{ isBox?: string }>
}

export default async function VaultPage({ params, searchParams }: VaultPageProps) {
  const { chainId, address } = await params
  const { isBox } = await searchParams
  const chainIdNum = Number(chainId)
  const vaultAddress = address as `0x${string}`

  const [vault, historical] = await Promise.all([
    getVault(steakhouseClient, { chainId: chainIdNum, vaultAddress, isBox: isBox === "true" }),
    getVaultHistory(steakhouseClient, { chainId: chainIdNum, vaultAddress }).catch(() => null),
  ])

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-5xl space-y-8 px-6 py-12">
        <div>
          <Link
            href="/vaults"
            className="text-muted-foreground text-sm underline underline-offset-4 hover:opacity-80"
          >
            &larr; Back to Vaults
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">{vault.name}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {vault.chain.name} &middot; {PROTOCOL_LABELS[vault.__typename] ?? vault.__typename}
            {vault.strategy ? ` \u00b7 ${vault.strategy}` : ""}
          </p>
          {vault.description && (
            <div className="text-muted-foreground prose prose-sm dark:prose-invert mt-2 max-w-none">
              <Markdown>{vault.description}</Markdown>
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader>
              <CardDescription>Total Assets</CardDescription>
              <CardTitle className="text-2xl">{formatUsd(vault.totalAssets.usd)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground font-mono text-sm">
                {formatAmount(vault.totalAssets.formatted)} {vault.asset.symbol}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>APY Instant</CardDescription>
              <CardTitle className="text-2xl">{formatApy(vault.apyInstant?.total)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Base: {formatApy(vault.apyInstant?.base)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>APY 1d</CardDescription>
              <CardTitle className="text-2xl">{formatApy(vault.apy1d?.total)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">Base: {formatApy(vault.apy1d?.base)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>APY 7d</CardDescription>
              <CardTitle className="text-2xl">{formatApy(vault.apy7d?.total)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">Base: {formatApy(vault.apy7d?.base)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>APY 30d</CardDescription>
              <CardTitle className="text-2xl">{formatApy(vault.apy30d?.total)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">Base: {formatApy(vault.apy30d?.base)}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Vault Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground text-sm">Address</dt>
                <dd className="font-mono text-sm break-all">{vault.address}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-sm">Underlying Asset</dt>
                <dd className="text-sm">
                  {vault.asset.name} ({vault.asset.symbol})
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-sm">Chain</dt>
                <dd className="text-sm">
                  {vault.chain.name} (ID: {vault.chain.id})
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-sm">Protocol</dt>
                <dd className="text-sm">{PROTOCOL_LABELS[vault.__typename] ?? vault.__typename}</dd>
              </div>
              {vault.riskAssessment?.steakhouse && (
                <div>
                  <dt className="text-muted-foreground text-sm">Risk Rating</dt>
                  <dd className="text-sm">
                    {vault.riskAssessment.steakhouse.rating} (Score:{" "}
                    {leverageFormat.format(vault.riskAssessment.steakhouse.score)})
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        {/* Liquidity */}
        {vault.__typename === "MorphoVault" &&
          "totalLiquidity" in vault &&
          vault.totalLiquidity && (
            <Card>
              <CardHeader>
                <CardTitle>Liquidity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-sm">
                  {formatUsd(vault.totalLiquidity.usd)}{" "}
                  <span className="text-muted-foreground">
                    ({formatAmount(vault.totalLiquidity.formatted)} {vault.asset.symbol})
                  </span>
                </p>
              </CardContent>
            </Card>
          )}

        {vault.__typename === "MorphoVaultV2" && "liquidityAssets" in vault && (
          <div className="grid gap-4 sm:grid-cols-3">
            {vault.nav && (
              <Card>
                <CardHeader>
                  <CardDescription>NAV</CardDescription>
                  <CardTitle className="text-2xl">{formatUsd(vault.nav.usd)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground font-mono text-sm">
                    {formatAmount(vault.nav.formatted)} {vault.asset.symbol}
                  </p>
                </CardContent>
              </Card>
            )}
            {vault.liquidityAssets && (
              <Card>
                <CardHeader>
                  <CardDescription>Liquidity Assets</CardDescription>
                  <CardTitle className="text-2xl">{formatUsd(vault.liquidityAssets.usd)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground font-mono text-sm">
                    {formatAmount(vault.liquidityAssets.formatted)} {vault.asset.symbol}
                  </p>
                </CardContent>
              </Card>
            )}
            {vault.idleAssets && (
              <Card>
                <CardHeader>
                  <CardDescription>Idle Assets</CardDescription>
                  <CardTitle className="text-2xl">{formatUsd(vault.idleAssets.usd)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground font-mono text-sm">
                    {formatAmount(vault.idleAssets.formatted)} {vault.asset.symbol}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Allocations - Morpho V1 */}
        {vault.__typename === "MorphoVault" && "allocations" in vault && vault.allocations && (
          <Card>
            <CardHeader>
              <CardTitle>Market Allocations</CardTitle>
              <CardDescription>
                {(vault.allocations as Array<unknown>).length} market
                {(vault.allocations as Array<unknown>).length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 pr-4 font-medium">Market</th>
                      <th className="pb-3 pr-4 font-medium">Collateral</th>
                      <th className="pb-3 pr-4 text-right font-medium">LLTV</th>
                      <th className="pb-3 pr-4 text-right font-medium">Supply</th>
                      <th className="pb-3 pr-4 text-right font-medium">Cap</th>
                      <th className="pb-3 pr-4 text-right font-medium">APY Instant</th>
                      <th className="pb-3 pr-4 text-right font-medium">APY 1d</th>
                      <th className="pb-3 pr-4 text-right font-medium">APY 7d</th>
                      <th className="pb-3 text-right font-medium">APY 30d</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(
                      vault.allocations as Array<{
                        market: {
                          name: string
                          collateralAsset: { symbol: string } | null
                          lltv: { formatted: string } | null
                          supplyApy: { total: number } | null
                          supplyApy1d: { total: number } | null
                          supplyApy7d: { total: number } | null
                          supplyApy30d: { total: number } | null
                        }
                        position: { supplyAmount: { usd: number | null; formatted: string } } | null
                        supplyCap: { usd: number | null; formatted: string } | null
                      }>
                    ).map((alloc) => (
                      <tr key={alloc.market.name} className="border-b last:border-0">
                        <td className="py-3 pr-4">{alloc.market.name}</td>
                        <td className="text-muted-foreground py-3 pr-4 font-mono">
                          {alloc.market.collateralAsset?.symbol ?? "-"}
                        </td>
                        <td className="py-3 pr-4 text-right font-mono">
                          {alloc.market.lltv?.formatted ?? "-"}
                        </td>
                        <td className="py-3 pr-4 text-right font-mono">
                          {formatUsd(alloc.position?.supplyAmount?.usd)}
                        </td>
                        <td className="py-3 pr-4 text-right font-mono">
                          {formatUsd(alloc.supplyCap?.usd)}
                        </td>
                        <td className="py-3 pr-4 text-right font-mono">
                          {formatApy(alloc.market.supplyApy?.total)}
                        </td>
                        <td className="py-3 pr-4 text-right font-mono">
                          {formatApy(alloc.market.supplyApy1d?.total)}
                        </td>
                        <td className="py-3 pr-4 text-right font-mono">
                          {formatApy(alloc.market.supplyApy7d?.total)}
                        </td>
                        <td className="py-3 text-right font-mono">
                          {formatApy(alloc.market.supplyApy30d?.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Allocations - Morpho V2 */}
        {vault.__typename === "MorphoVaultV2" && "allocations" in vault && vault.allocations && (
          <Card>
            <CardHeader>
              <CardTitle>Adapter Allocations</CardTitle>
              <CardDescription>
                {(vault.allocations as Array<unknown>).length} adapter
                {(vault.allocations as Array<unknown>).length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 pr-4 font-medium">Adapter</th>
                      <th className="pb-3 pr-4 font-medium">Type</th>
                      <th className="pb-3 pr-4 font-medium">Risk</th>
                      <th className="pb-3 pr-4 text-right font-medium">Allocation</th>
                      <th className="pb-3 pr-4 text-right font-medium">Relative Cap</th>
                      <th className="pb-3 text-right font-medium">Absolute Cap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(
                      vault.allocations as Array<{
                        __typename: string
                        name: string | null
                        adapterAddress: string
                        vault?: { __typename: string; address: string } | null
                        riskAssessment: {
                          steakhouse: { rating: string; score: number } | null
                        } | null
                        adapterCap: {
                          allocation: { usd: number | null } | null
                          absoluteCap: { usd: number | null } | null
                          relativeCap: { formatted: string } | null
                        } | null
                      }>
                    ).map((alloc) => {
                      const isVaultAdapter = !!alloc.vault?.address
                      const adapterIsBox = alloc.vault?.__typename === "BoxVault"
                      const vaultHref = `/vaults/${vault.chain.id}/${alloc.vault?.address}${adapterIsBox ? "?isBox=true" : ""}`
                      const label = alloc.name ?? (
                        <span className="font-mono text-xs">{alloc.adapterAddress}</span>
                      )
                      return (
                        <tr key={alloc.adapterAddress} className="border-b last:border-0">
                          <td className="py-3 pr-4">
                            {isVaultAdapter ? (
                              <Link
                                href={vaultHref}
                                className="text-primary underline underline-offset-4 hover:opacity-80"
                              >
                                {label}
                              </Link>
                            ) : (
                              label
                            )}
                          </td>
                          <td className="text-muted-foreground py-3 pr-4">
                            {alloc.vault
                              ? (PROTOCOL_LABELS[alloc.vault.__typename] ?? alloc.vault.__typename)
                              : alloc.__typename === "MarketV1Adapter"
                                ? "Market V1"
                                : alloc.__typename}
                          </td>
                          <td className="text-muted-foreground py-3 pr-4">
                            {alloc.riskAssessment?.steakhouse?.rating ?? "-"}
                          </td>
                          <td className="py-3 pr-4 text-right font-mono">
                            {formatUsd(alloc.adapterCap?.allocation?.usd)}
                          </td>
                          <td className="py-3 pr-4 text-right font-mono">
                            {alloc.adapterCap?.relativeCap
                              ? formatApy(Number(alloc.adapterCap.relativeCap.formatted))
                              : "-"}
                          </td>
                          <td className="py-3 text-right font-mono">
                            {formatUsd(alloc.adapterCap?.absoluteCap?.usd)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Allocations - Box Vault */}
        {vault.__typename === "BoxVault" && "allocations" in vault && vault.allocations && (
          <Card>
            <CardHeader>
              <CardTitle>Token Allocations</CardTitle>
              {"leverage" in vault && vault.leverage != null && (
                <CardDescription>
                  Leverage: {leverageFormat.format(vault.leverage as number)}x
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 pr-4 font-medium">Token</th>
                      <th className="pb-3 text-right font-medium">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(
                      vault.allocations as Array<{
                        token: { symbol: string }
                        balance: { usd: number | null; formatted: string }
                      }>
                    ).map((alloc) => (
                      <tr key={alloc.token.symbol} className="border-b last:border-0">
                        <td className="py-3 pr-4 font-mono">{alloc.token.symbol}</td>
                        <td className="py-3 text-right font-mono">
                          {formatUsd(alloc.balance.usd)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Funding Modules - Box Vault */}
        {vault.__typename === "BoxVault" &&
          "fundingModules" in vault &&
          vault.fundingModules &&
          (
            vault.fundingModules as Array<{
              fundingModuleAddress: string
              nav: { usd: number | null; formatted: string } | null
              positions?: Array<{
                market: {
                  name: string
                  collateralAsset: { symbol: string } | null
                  loanAsset: { symbol: string } | null
                  lltv: { formatted: string } | null
                  borrowApy: { total: number } | null
                  borrowApy1d: { total: number } | null
                  borrowApy7d: { total: number } | null
                  borrowApy30d: { total: number } | null
                }
                loopingLeverage: number | null
                loopingNetApy: number | null
                collateralAmount: { usd: number | null; formatted: string }
                borrowAmount: { usd: number | null; formatted: string }
              }>
            }>
          ).map((fm) => (
            <Card key={fm.fundingModuleAddress}>
              <CardHeader>
                <CardTitle>Funding Module</CardTitle>
                <CardDescription>
                  <span className="font-mono text-xs">{fm.fundingModuleAddress}</span>
                  {fm.nav && (
                    <span className="ml-2">
                      NAV: {formatUsd(fm.nav.usd)} ({formatAmount(fm.nav.formatted)}{" "}
                      {vault.asset.symbol})
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              {fm.positions && fm.positions.length > 0 && (
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="pb-3 pr-4 font-medium">Market</th>
                          <th className="pb-3 pr-4 font-medium">Collateral</th>
                          <th className="pb-3 pr-4 text-right font-medium">LLTV</th>
                          <th className="pb-3 pr-4 text-right font-medium">Leverage</th>
                          <th className="pb-3 pr-4 text-right font-medium">Net APY</th>
                          <th className="pb-3 pr-4 text-right font-medium">Collateral</th>
                          <th className="pb-3 pr-4 text-right font-medium">Borrow</th>
                          <th className="pb-3 pr-4 text-right font-medium">APY Instant</th>
                          <th className="pb-3 pr-4 text-right font-medium">APY 1d</th>
                          <th className="pb-3 pr-4 text-right font-medium">APY 7d</th>
                          <th className="pb-3 text-right font-medium">APY 30d</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fm.positions.map((pos) => (
                          <tr key={pos.market.name} className="border-b last:border-0">
                            <td className="py-3 pr-4">{pos.market.name}</td>
                            <td className="text-muted-foreground py-3 pr-4 font-mono">
                              {pos.market.collateralAsset?.symbol ?? "-"}
                            </td>
                            <td className="py-3 pr-4 text-right font-mono">
                              {pos.market.lltv?.formatted ?? "-"}
                            </td>
                            <td className="py-3 pr-4 text-right font-mono">
                              {pos.loopingLeverage != null
                                ? `${leverageFormat.format(pos.loopingLeverage)}x`
                                : "-"}
                            </td>
                            <td className="py-3 pr-4 text-right font-mono">
                              {formatApy(pos.loopingNetApy)}
                            </td>
                            <td className="py-3 pr-4 text-right font-mono">
                              {formatUsd(pos.collateralAmount.usd)}
                            </td>
                            <td className="py-3 pr-4 text-right font-mono">
                              {formatUsd(pos.borrowAmount.usd)}
                            </td>
                            <td className="py-3 pr-4 text-right font-mono">
                              {formatApy(pos.market.borrowApy?.total)}
                            </td>
                            <td className="py-3 pr-4 text-right font-mono">
                              {formatApy(pos.market.borrowApy1d?.total)}
                            </td>
                            <td className="py-3 pr-4 text-right font-mono">
                              {formatApy(pos.market.borrowApy7d?.total)}
                            </td>
                            <td className="py-3 text-right font-mono">
                              {formatApy(pos.market.borrowApy30d?.total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}

        {historical && (
          <Card>
            <CardHeader>
              <CardTitle>Historical Performance</CardTitle>
              <CardDescription>Returns and TVL over time</CardDescription>
            </CardHeader>
            <CardContent>
              <VaultHistoryChart historical={historical} assetSymbol={vault.asset.symbol} />
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
