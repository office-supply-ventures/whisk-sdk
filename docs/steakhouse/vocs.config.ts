import { defineConfig } from "vocs"

export default defineConfig({
  rootDir: "./",
  title: "Steakhouse SDK",
  twoslash: {
    compilerOptions: {
      strict: true,
      // ModuleResolutionKind.Bundler = 100
      moduleResolution: 100,
      // Use "src" condition to resolve workspace packages to source files
      customConditions: ["src"],
    },
  },
  description: "Type-safe SDK for Steakhouse-curated DeFi vaults",
  sidebar: [
    {
      text: "Getting Started",
      link: "/getting-started",
    },
    {
      text: "Queries",
      link: "/queries",
    },
    {
      text: "React Hooks",
      link: "/react",
    },
  ],
  socials: [
    {
      icon: "github",
      link: "https://github.com/papercliplabs/whisk-sdk",
    },
    {
      icon: "x",
      link: "https://x.com/SteakhouseFi",
    },
  ],
  topNav: [{ text: "Docs", link: "/getting-started", match: "/docs" }],
})
