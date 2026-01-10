"use client"

import { type GetVaultsVariables, getVaults } from "../../queries/getVaults.js"
import { useSteakhouseQuery } from "./useSteakhouseQuery.js"

export function useVaults(variables: GetVaultsVariables) {
  return useSteakhouseQuery({
    queryName: "vaults",
    queryFn: getVaults,
    variables,
  })
}
