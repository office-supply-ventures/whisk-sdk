import * as fs from "node:fs"
import { getIntrospectedSchema, minifyIntrospectionQuery } from "@urql/introspection"
import { getIntrospectionQuery } from "graphql"

fetch("https://api-v2.whisk.so/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    variables: {},
    query: getIntrospectionQuery({ descriptions: false }),
    operationName: "IntrospectionQuery",
  }),
})
  .then((result) => {
    return result.json()
  })
  .then(({ data }) => {
    const minified = minifyIntrospectionQuery(getIntrospectedSchema(data), { includeScalars: true })
    fs.mkdirSync("./src/generated", { recursive: true })
    fs.writeFileSync("./src/generated/schema.json", JSON.stringify(minified))
  })
