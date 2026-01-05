import type { WhiskClient } from "./WhiskClient.js"

export type WhiskActionFn<TData, TVariables = void> = (
  client: WhiskClient,
  variables: TVariables,
) => Promise<TData>
