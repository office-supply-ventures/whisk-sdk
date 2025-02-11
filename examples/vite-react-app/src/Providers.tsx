import { WhiskSdkProvider } from "@paperclip-labs/whisk-sdk";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WhiskSdkProvider apiKey={import.meta.env.VITE_WHISK_API_KEY!} config={{}}>
      {children}
    </WhiskSdkProvider>
  );
}
