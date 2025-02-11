import { GraphQLClient } from "graphql-request";
import { CONFIG } from "@/config";

export function createWhiskClient(apiKey: string) {
  return new GraphQLClient(CONFIG.whiskServerUrl + "/graphql", {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
}
