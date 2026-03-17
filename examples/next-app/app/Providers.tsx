"use client"

import { SteakhouseProvider } from "@steakhouse/sdk/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { steakhouseClient } from "../lib/steakhouse"

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SteakhouseProvider client={steakhouseClient}>{children}</SteakhouseProvider>
    </QueryClientProvider>
  )
}
