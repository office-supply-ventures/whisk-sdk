import { useQuery } from "@tanstack/react-query"
import type { WhiskActionFn } from "@whisk/client"
import { useWhisk } from "../WhiskProvider.js"

export function useWhiskQuery<TData, TVariables>({
  queryName,
  actionFn,
  variables,
}: {
  queryName: string
  actionFn: WhiskActionFn<TData, TVariables>
  variables: TVariables
}) {
  const { client } = useWhisk()
  return useQuery({
    queryKey: [queryName, variables],
    queryFn: () => actionFn(client, variables),
  })
}
