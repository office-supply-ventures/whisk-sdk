import type { AnyVariables, TypedDocumentNode } from "@urql/core"
import { WhiskClient, type WhiskClientConfig } from "@whisk/client"

export interface SteakhouseClientConfig extends WhiskClientConfig {}

export class SteakhouseClient {
  private readonly client: WhiskClient

  constructor(config: SteakhouseClientConfig) {
    this.client = new WhiskClient(config)
  }

  public async query<TValue, TVariables extends AnyVariables>(
    document: TypedDocumentNode<TValue, TVariables>,
    variables: TVariables,
  ): Promise<TValue> {
    return this.client.query(document, variables)
  }
}
