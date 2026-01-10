import type { SteakhouseClient } from "../client.js"

export type SteakhouseQueryFn<TData, TVariables> = (
  client: SteakhouseClient,
  variables: TVariables,
) => Promise<TData>
