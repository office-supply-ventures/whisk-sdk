import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/**/*.ts", "src/**/*.tsx", "!src/**.d.ts", "!src/**.test.ts"],
  outDir: "dist",
  splitting: false,
  sourcemap: true,
  treeshake: true,
  clean: true,
  bundle: false, // Let consumers bundle
  minify: false, // Let consumers minify
  dts: {
    resolve: true,
  },
  platform: "neutral",
  format: ["esm"],
})
