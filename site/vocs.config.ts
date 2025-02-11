import { defineConfig } from "vocs";
import { ModuleKind, ModuleResolutionKind, ScriptTarget } from "typescript";
import "dotenv/config";

export default defineConfig({
  vite: {
    ssr: {
      noExternal: ["@paperclip-labs/whisk-sdk", "@paperclip-labs/whisk-core"],
    },
    define: {
      "import.meta.env.VITE_WHISK_API_KEY": JSON.stringify(process.env.VITE_WHISK_API_KEY),
    },
  },
  twoslash: {
    compilerOptions: {
      allowUmdGlobalAccess: true,
      esModuleInterop: true,
      target: ScriptTarget.ES2022,
      module: ModuleKind.ES2022,
      moduleResolution: ModuleResolutionKind.Bundler,
    },
  },
  baseUrl: "https://docs.whisk.so/",
  title: "Whisk SDK",
  description: "Simplify dApp development with modular kits for Whisk's blockchain data pipelines.",
  logoUrl: {
    light: "/logo-light.svg",
    dark: "/logo-dark.svg",
  },
  iconUrl: {
    light: "/icon-light.png",
    dark: "/icon-dark.png",
  },
  ogImageUrl: "https://vocs.dev/api/og?logo=%logo&title=%title&description=%description",
  sidebar: [
    {
      text: "Getting Started",
      link: "/getting-started",
    },
    {
      text: "Kits",
      items: [
        {
          text: "Identity Kit",
          link: "/kits/identity",
        },
      ],
    },
    {
      text: "GraphQL",
      link: "/graphql",
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
});
