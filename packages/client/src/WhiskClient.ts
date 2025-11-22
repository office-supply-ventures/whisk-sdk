import {
  type AnyVariables,
  cacheExchange,
  fetchExchange,
  type TypedDocumentNode,
  Client as UrqlClient,
} from "@urql/core"
import { errAsync, okAsync, ResultAsync } from "neverthrow"
import { WhiskError } from "./errors.js"
import { scalarsExchange } from "./scalarExchange.js"

const DEFAULT_WHISK_API_URL = "https://api-v2.whisk.so/graphql"

export interface WhiskClientConfig {
  readonly apiKey: string
  readonly url?: string
  readonly debug?: boolean
}

export class WhiskClient {
  private readonly urql: UrqlClient
  private readonly debug: boolean

  constructor({ apiKey, url = DEFAULT_WHISK_API_URL, debug = false }: WhiskClientConfig) {
    this.urql = new UrqlClient({
      url,
      exchanges: [scalarsExchange, cacheExchange, fetchExchange],
      fetchOptions: {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      },
    })

    this.debug = debug
  }

  public query<TValue, TVariables extends AnyVariables>(
    document: TypedDocumentNode<TValue, TVariables>,
    variables: TVariables,
  ): ResultAsync<TValue, WhiskError> {
    return ResultAsync.fromPromise(this.urql.query(document, variables), (error: unknown) =>
      WhiskError.from(error),
    ).andThen((result) => {
      // Bubbles up any network errors
      if (result.error?.networkError) {
        return errAsync(WhiskError.from(result.error.networkError))
      }

      // Error if we have no data
      if (result.data === undefined) {
        return errAsync(WhiskError.from("No data returned from query"))
      }

      // Log any graphql errors (but don't put into error, since partial is fine)
      if ((result.error?.graphQLErrors?.length ?? 0) > 0 && this.debug) {
        console.debug("[Whisk Client] GraphQL errors:", result.error?.graphQLErrors)
      }

      return okAsync(result.data)
    })
  }
}
