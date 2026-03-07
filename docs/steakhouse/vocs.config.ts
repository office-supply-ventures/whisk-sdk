import { defineConfig } from "vocs"

export default defineConfig({
  rootDir: "./",
  title: "Steakhouse SDK",
  iconUrl: "/icon.svg",
  logoUrl: {
    light: "/logo-light.svg",
    dark: "/logo-dark.svg",
  },
  theme: {
    accentColor: {
      backgroundAccent: { light: "#086552", dark: "#0A856C" },
      backgroundAccentHover: { light: "#075a48", dark: "#09977b" },
      backgroundAccentText: { light: "#FEFCF0", dark: "#FFFDF1" },
      textAccent: { light: "#086552", dark: "#0A856C" },
      textAccentHover: { light: "#075a48", dark: "#09977b" },
      borderAccent: { light: "#086552", dark: "#0A856C" },
    },
    variables: {
      color: {
        background: { light: "#FAF5E5", dark: "#0E1011" },
        backgroundDark: { light: "#F3EEDE", dark: "#1A1E20" },
        text: { light: "#1A1E20", dark: "#FAF5E5" },
        textAccent: { light: "#086552", dark: "#0A856C" },
        text2: { light: "#515A5E", dark: "#CBC9C1" },
        text3: { light: "#515A5E", dark: "#CBC9C1" },
        border: { light: "#E2DDCC", dark: "#2E3031" },
        borderAccent: { light: "#086552", dark: "#0A856C" },
      },
    },
  },
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
      text: "Direct GraphQL",
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
      link: "https://x.com/SteakhouseFi",
    },
  ],
  topNav: [
    { text: "Docs", link: "/getting-started", match: "/" },
    {
      text: "Changelog",
      link: "https://github.com/papercliplabs/whisk-sdk/blob/main/packages/steakhouse/CHANGELOG.md",
    },
  ],
})
