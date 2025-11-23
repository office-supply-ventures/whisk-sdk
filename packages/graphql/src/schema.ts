import type { IntrospectionQuery } from "graphql"
import schemaData from "./generated/schema.json" with { type: "json" }

export const schema = schemaData as IntrospectionQuery
