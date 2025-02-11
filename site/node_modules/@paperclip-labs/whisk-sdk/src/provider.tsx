"use client";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useRef } from "react";
import { Address } from "viem";
import { IdentityResolverInput } from "./generated/gql/whisk/graphql";
import { createWhiskClient } from "./utils/graphql";

export interface IdentityKitConfig {
  resolverOrder?: IdentityResolverInput[]; // List of resolvers to use, will process sequentially until one resolves.
  overrides?: Record<Address, { name: string; avatar: string } | undefined>; // Override for a given address.
}

export interface WhiskSdkConfig {
  identity?: IdentityKitConfig;
}

export interface WhiskSdkContextType {
  whiskClient?: ReturnType<typeof createWhiskClient>;
  config: WhiskSdkConfig;
}

const WhiskSdkContext = createContext<WhiskSdkContextType>({
  whiskClient: undefined,
  config: {},
});

export interface WhiskSdkProviderParams {
  apiKey: string;
  config: WhiskSdkConfig;
  children: ReactNode;
}

export function WhiskSdkProvider({ apiKey, config, children }: WhiskSdkProviderParams) {
  const queryClientRef = useRef<QueryClient | null>(null);
  const whiskClient = createWhiskClient(apiKey);

  try {
    const existingQueryClient = useQueryClient();
    queryClientRef.current = existingQueryClient;
  } catch {
    if (!queryClientRef.current) {
      // No existing client, so let's make one
      queryClientRef.current = new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            staleTime: 1000 * 60, // 5 minutes
          },
        },
      });
    }
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <WhiskSdkContext.Provider value={{ whiskClient, config }}>{children}</WhiskSdkContext.Provider>
    </QueryClientProvider>
  );
}

export function useWhiskSdkContext() {
  return useContext(WhiskSdkContext);
}
