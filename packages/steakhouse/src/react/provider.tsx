"use client"

import type React from "react"
import { createContext, type PropsWithChildren, useContext } from "react"
import type { SteakhouseClient } from "../client.js"

export interface SteakhouseContextValue {
  client: SteakhouseClient
}

const SteakhouseContext = createContext<SteakhouseContextValue | null>(null)

export function useSteakhouse(): SteakhouseContextValue {
  const context = useContext(SteakhouseContext)
  if (!context) {
    throw new Error("useSteakhouse must be used within a SteakhouseProvider")
  }
  return context
}

export interface SteakhouseProviderProps extends PropsWithChildren {
  client: SteakhouseClient
}

export function SteakhouseProvider({
  children,
  client,
}: SteakhouseProviderProps): React.JSX.Element {
  return <SteakhouseContext.Provider value={{ client }}>{children}</SteakhouseContext.Provider>
}
