import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/*.ts", "src/**/*.tsx", "!src/**.d.ts", "!src/**.test.ts"],
  outDir: "dist",
  splitting: false,
  sourcemap: true,
  clean: true,
  bundle: false, // Let consumer do
  treeshake: false, // Let consumer do
  minify: false, // Let consumers do
  tsconfig: "tsconfig.build.json",
  dts: {
    resolve: true,
  },
  platform: "neutral",
  format: ["esm"],
});
