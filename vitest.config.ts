import path from "node:path"
import { fileURLToPath } from "node:url"
import { config } from "dotenv"
import { defineConfig } from "vitest/config"

config({ path: ".env.test" })

const resolveFromRoot = (relativePath: string) =>
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), relativePath)

export default defineConfig({
  resolve: {
    alias: {
      "@whisk/graphql": resolveFromRoot("packages/graphql/src/index.ts"),
      "@whisk/client": resolveFromRoot("packages/client/src/index.ts"),
      "@whisk/react": resolveFromRoot("packages/react/src/index.ts"),
    },
  },
  test: {
    globals: true,
  },
})
