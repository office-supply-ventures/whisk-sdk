"use client";
import { Address } from "viem";
import { useQuery } from "@tanstack/react-query";
import { graphql } from "@/generated/gql/whisk";
import { useWhiskSdkContext } from "@/provider";
import { IdentityResolver } from "../types";

const Name_IdentityQuery = graphql(/* GraphQL */ `
  query Name_IdentityQuery($address: String!, $resolverOrder: [IdentityResolverInput!]) {
    identity(address: $address, resolverOrder: $resolverOrder) {
      aggregate {
        name
      }
    }
  }
`);

export function useName({ address, resolverOrder }: { address: Address; resolverOrder?: IdentityResolver[] }) {
  const { config, whiskClient } = useWhiskSdkContext();
  return useQuery({
    queryKey: ["identity", "name", resolverOrder, address],
    queryFn: async () =>
      await whiskClient?.request(Name_IdentityQuery, {
        address,
        resolverOrder: resolverOrder ?? config.identity?.resolverOrder,
      }),
    select: (data) => {
      return data?.identity?.aggregate.name;
    },
  });
}
