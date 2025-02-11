import type { CodegenConfig } from "@graphql-codegen/cli";
import { CONFIG } from "./src/config";
import dotenv from "dotenv";

dotenv.config();

const config: CodegenConfig = {
  overwrite: true,
  ignoreNoDocuments: true, // for better experience with the watcher
  schema: {
    [CONFIG.whiskServerUrl + "/graphql"]: {
      headers: { Authorization: `Bearer ${process.env.WHISK_BUILD_TIME_API_KEY!}` },
    },
  },
  generates: {
    "./src/generated/gql/whisk/": {
      documents: ["src/**/*"],
      preset: "client",
      presetConfig: {
        // fragmentMasking: false, // To make the hooks more useful
      },
    },
    "./src/generated/gql/whisk/schema.graphql": {
      plugins: ["schema-ast"],
      config: {
        includeDirectives: true,
      },
    },
  },
};

export default config;
