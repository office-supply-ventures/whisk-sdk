import type { AnyVariables, TypedDocumentNode } from "@urql/core"
import { WhiskClient, type WhiskClientConfig } from "@whisk/client"

export class SteakhouseClient {
  private readonly client: WhiskClient

  constructor(config: WhiskClientConfig) {
    this.client = new WhiskClient(config)
  }

  public async query<TValue, TVariables extends AnyVariables>(
    document: TypedDocumentNode<TValue, TVariables>,
    variables: TVariables,
  ): Promise<TValue> {
    return this.client.query(document, variables)
  }
}

/**
 * Create a Steakhouse client for querying vault data.
 */
export function createSteakhouseClient(config: WhiskClientConfig): SteakhouseClient {
  return new SteakhouseClient(config)
}
