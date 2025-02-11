"use client";
import { ReactNode } from "react";
import { WhiskSdkProvider as _WhiskSdkProvider } from "@paperclip-labs/whisk-sdk";

export default function WhiskSdkProvider({ children }: { children: ReactNode }) {
  return (
    <_WhiskSdkProvider apiKey={process.env.NEXT_PUBLIC_WHISK_API_KEY!} config={{}}>
      {children}
    </_WhiskSdkProvider>
  );
}
