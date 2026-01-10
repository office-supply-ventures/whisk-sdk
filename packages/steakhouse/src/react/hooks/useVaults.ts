"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import {
  type GetVaultsResult,
  type GetVaultsVariables,
  getVaults,
} from "../../queries/getVaults.js"
import { useSteakhouseQuery } from "./useSteakhouseQuery.js"

export function useVaults(variables: GetVaultsVariables): UseQueryResult<GetVaultsResult, Error> {
  return useSteakhouseQuery({
    queryName: "vaults",
    queryFn: getVaults,
    variables,
  })
}
