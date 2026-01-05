import {
  type AnyVariables,
  cacheExchange,
  fetchExchange,
  type TypedDocumentNode,
  Client as UrqlClient,
} from "@urql/core"
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

  public async query<TValue, TVariables extends AnyVariables>(
    document: TypedDocumentNode<TValue, TVariables>,
    variables: TVariables,
  ): Promise<TValue> {
    const result = await this.urql.query(document, variables)

    // Bubbles up any network errors
    if (result.error && !result.data) {
      throw WhiskError.from(result.error)
    }

    // Error if we have no data
    if (!result.data) {
      throw WhiskError.from("No data returned from query")
    }

    // Log any graphql errors (but don't put into error, since partial is fine)
    if (result.error && this.debug) {
      console.debug("[Whisk Client] GraphQL errors:", result.error)
    }

    return result.data
  }
}
