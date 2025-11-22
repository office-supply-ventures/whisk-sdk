import { config } from "dotenv"
import { defineConfig } from "vitest/config"

config({ path: ".env.test" }) // runs before Vitest reads the config

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ["dotenv/config"], //this line,
  },
})
