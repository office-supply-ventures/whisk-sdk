#!/usr/bin/env tsx

import * as fs from "node:fs"
import { getIntrospectedSchema, minifyIntrospectionQuery } from "@urql/introspection"
import {
  buildClientSchema,
  getIntrospectionQuery,
  type IntrospectionQuery,
  printSchema,
} from "graphql"

const url = process.argv[2]

if (!url) {
  console.error("Error: GraphQL endpoint URL is required")
  console.error("Usage: fetch-schema.ts <graphql-endpoint-url>")
  console.error("Example: fetch-schema.ts http://localhost:3000/graphql")
  process.exit(1)
}

console.log(`Fetching introspection from: ${url}`)

const response = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    variables: {},
    query: getIntrospectionQuery({ descriptions: false }),
    operationName: "IntrospectionQuery",
  }),
})

if (!response.ok) {
  throw new Error(`HTTP error: ${response.status}`)
}

const { data, errors } = (await response.json()) as { data: IntrospectionQuery; errors?: unknown[] }

if (errors) {
  console.error("GraphQL errors:", errors)
  process.exit(1)
}

// Minified introspection for runtime (urql scalar exchange)
const minified = minifyIntrospectionQuery(getIntrospectedSchema(data), {
  includeScalars: true,
})

// SDL for gql.tada type inference
const sdl = printSchema(buildClientSchema(data))

fs.mkdirSync("./src/generated", { recursive: true })
fs.writeFileSync("./src/generated/schema.json", JSON.stringify(minified))
fs.writeFileSync("./src/generated/schema.graphql", sdl)
console.log("Saved src/generated/schema.json and src/generated/schema.graphql")
