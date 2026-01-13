"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import {
  type GetDetailedVaultResult,
  type GetDetailedVaultVariables,
  getDetailedVault,
} from "../../queries/getDetailedVault.js"
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
