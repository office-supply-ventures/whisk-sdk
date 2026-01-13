import { defineConfig } from "vocs"

export default defineConfig({
  rootDir: "./",
  title: "Whisk",
  twoslash: {
    compilerOptions: {
      strict: true,
      // ModuleResolutionKind.Bundler = 100
      moduleResolution: 100,
      // Use "src" condition to resolve workspace packages to source files
      customConditions: ["src"],
    },
  },
  description: "Simplify dApp development with modular kits for Whisk's blockchain data pipelines.",
  logoUrl: {
    light: "/logo-light.svg",
    dark: "/logo-dark.svg",
  },
  sidebar: [
    {
      text: "Getting Started",
      link: "/getting-started",
    },
  ],
  socials: [
    {
      icon: "github",
      link: "https://github.com/papercliplabs/whisk-sdk",
    },
    {
      icon: "x",
      link: "https://x.com/PaperclipLabs",
    },
    {
      icon: "warpcast",
      link: "https://warpcast.com/papercliplabs",
    },
  ],
  topNav: [
    { text: "Docs", link: "/getting-started", match: "/docs" },
    // {
    //   text: "version",
    //   items: [
    //     {
    //       text: "Changelog",
    //       link: "https://github.com/wevm/vocs/blob/main/src/CHANGELOG.md",
    //     },
    //   ],
    // },
  ],
})
