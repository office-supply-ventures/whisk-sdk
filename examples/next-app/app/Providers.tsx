"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SteakhouseProvider } from "@whisk/steakhouse/react"
import { steakhouseClient } from "../lib/steakhouse"

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SteakhouseProvider client={steakhouseClient}>{children}</SteakhouseProvider>
    </QueryClientProvider>
  )
}
