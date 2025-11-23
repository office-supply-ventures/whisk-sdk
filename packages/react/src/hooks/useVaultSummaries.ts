"use client"

import { type GetVaultSummariesVariables, getVaultSummaries } from "@whisk/client"
import { useWhiskQuery } from "../utils/useWhiskQuery.js"

export function useVaultSummaries(variables: GetVaultSummariesVariables) {
  return useWhiskQuery({
    queryName: "vault-summaries",
    actionFn: getVaultSummaries,
    variables,
  })
}
