import { getVaults } from "@whisk/steakhouse"
import { STEAKHOUSE_VAULTS } from "@whisk/steakhouse/metadata"
import { steakhouseClient } from "../lib/steakhouse"
import { ClientComponent } from "./ClientComponent"

export default async function Home() {
  const vaults = await getVaults(steakhouseClient, { chainId: 1 })

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col gap-8 py-32 px-16 bg-white dark:bg-black">
        <section>
          {STEAKHOUSE_VAULTS.map((vault) => (
            <div key={vault.address}>{vault.address ?? "unk"}</div>
          ))}
          <h2 className="text-lg font-semibold mb-4">Server-side Fetching</h2>
          <div className="space-y-2">
            {vaults.slice(0, 5).map((vault) => (
              <div key={vault.vaultAddress} className="text-sm font-mono">
                {vault.vaultAddress.slice(0, 10)}... — {vault.totalAssets.raw}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Client-side Fetching</h2>
          <ClientComponent />
        </section>
      </main>
    </div>
  )
}
