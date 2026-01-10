import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/**/*.ts", "src/**/*.tsx", "!src/**/*.test.ts", "!src/**/*.d.ts"],
  outDir: "dist",
  splitting: false,
  sourcemap: true,
  clean: true,
  bundle: false,
  treeshake: false,
  minify: false,
  tsconfig: "tsconfig.build.json",
  dts: {
    resolve: true,
  },
  platform: "neutral",
  format: ["esm"],
})
