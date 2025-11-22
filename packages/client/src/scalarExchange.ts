import customScalarsExchange from "@atmina/urql-custom-scalars-exchange"
import { schema } from "@whisk/graphql"

// @ts-expect-error - Package has CJS/ESM interop issues with verbatimModuleSyntax
export const scalarsExchange = customScalarsExchange({
  schema,
  scalars: {
    BigInt(value: string) {
      return BigInt(value)
    },
  },
})
