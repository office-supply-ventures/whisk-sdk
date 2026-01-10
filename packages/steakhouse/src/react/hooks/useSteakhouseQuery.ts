"use client"

import { type UseQueryResult, useQuery } from "@tanstack/react-query"
import type { SteakhouseQueryFn } from "../../queries/types.js"
import { useSteakhouse } from "../provider.js"

export function useSteakhouseQuery<TData, TVariables>(options: {
  queryName: string
  queryFn: SteakhouseQueryFn<TData, TVariables>
  variables: TVariables
}): UseQueryResult<TData, Error> {
  const { client } = useSteakhouse()
  return useQuery({
    queryKey: [options.queryName, options.variables],
    queryFn: () => options.queryFn(client, options.variables),
  })
}
