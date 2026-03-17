import { SteakhouseClient } from "@steakhouse/sdk"

export const steakhouseClient = new SteakhouseClient({
  url: process.env.NEXT_PUBLIC_WHISK_API_URL ?? "https://staging.api-v2.whisk.so/graphql",
  apiKey: process.env.NEXT_PUBLIC_WHISK_API_KEY ?? "",
})
