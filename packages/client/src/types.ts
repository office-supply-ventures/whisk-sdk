import type { ResultAsync } from "neverthrow"
import type { WhiskError } from "./errors.js"
import type { WhiskClient } from "./WhiskClient.js"

export type WhiskActionFn<TData, TVariables = void> = (
  client: WhiskClient,
  variables: TVariables,
) => ResultAsync<TData, WhiskError>
