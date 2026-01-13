"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import {
  type GetDetailedVaultResult,
  type GetDetailedVaultVariables,
  getDetailedVault,
} from "../../queries/getVault.js"
import { useSteakhouseQuery } from "./useSteakhouseQuery.js"

export function useDetailedVault(
  variables: GetDetailedVaultVariables,
): UseQueryResult<GetDetailedVaultResult, Error> {
  return useSteakhouseQuery({
    queryName: "detailedVault",
    queryFn: getDetailedVault,
    variables,
  })
}
