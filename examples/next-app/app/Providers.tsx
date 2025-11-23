"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WhiskClient } from "@whisk/client"
import { WhiskProvider } from "@whisk/react"

const whiskClient = new WhiskClient({
  url: "https://staging.api-v2.whisk.so/graphql",
  apiKey: process.env.NEXT_PUBLIC_WHISK_API_KEY as string,
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WhiskProvider client={whiskClient}>{children}</WhiskProvider>
    </QueryClientProvider>
  )
}
