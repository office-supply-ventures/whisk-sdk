"use client"

import type { WhiskClient } from "@whisk/client"
import { createContext, type PropsWithChildren } from "react"
import { useMandatoryContext } from "./utils/useManditoryContext.js"

interface WhiskProviderProps extends PropsWithChildren {
  client: WhiskClient
}

type UseWhiskResponse = ReturnType<typeof useWhiskHook>
const WhiskContext = createContext<UseWhiskResponse | null>(null)

function useWhiskHook(client: WhiskClient) {
  return {
    client,
  }
}

export function WhiskProvider({ children, client }: WhiskProviderProps) {
  const hook = useWhiskHook(client)

  return <WhiskContext.Provider value={hook}>{children}</WhiskContext.Provider>
}

export const useWhisk = () => useMandatoryContext(WhiskContext, "Whisk")
