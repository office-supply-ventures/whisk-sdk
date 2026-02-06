"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import { useQuery } from "@tanstack/react-query"
import { type GetTvlResult, getTvl } from "../../queries/index.js"
import { useSteakhouse } from "../provider.js"

export function useTvl(): UseQueryResult<GetTvlResult, Error> {
  const { client } = useSteakhouse()
  return useQuery({
    queryKey: ["steakhouse", "tvl"],
    queryFn: () => getTvl(client),
  })
}
