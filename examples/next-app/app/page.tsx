import { getTvl } from "@whisk/steakhouse"
import { steakhouseClient } from "../lib/steakhouse"
import { ClientComponent } from "./ClientComponent"

export default async function Home() {
  const tvl = await getTvl(steakhouseClient)

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col gap-8 py-32 px-16 bg-white dark:bg-black">
        <section>
          <h2 className="text-lg font-semibold mb-4">
            Total TVL: ${tvl.totalUsd.toLocaleString()}
          </h2>
          <div className="space-y-2">
            {tvl.byChain.map((item) => (
              <div key={item.chain.id} className="text-sm font-mono">
                {item.chain.name}: ${item.tvlUsd.toLocaleString()}
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
