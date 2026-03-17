import { getVaults } from "@steakhouse/sdk"
import { steakhouseClient } from "../../lib/steakhouse"
import { VaultsTable } from "./VaultsTable"

export default async function VaultsPage() {
  const vaults = await getVaults(steakhouseClient)

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl space-y-8 px-6 py-12">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Steakhouse Vaults</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Browse Steakhouse vaults across chains
          </p>
        </div>

        <VaultsTable vaults={vaults} />
      </main>
    </div>
  )
}
