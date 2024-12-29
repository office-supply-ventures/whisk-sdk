import Providers from "./providers";
import { Analytics } from "@vercel/analytics/react";

import "@paperclip-labs/whisk-sdk/styles.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      {children}
      <Analytics />
    </Providers>
  );
}
