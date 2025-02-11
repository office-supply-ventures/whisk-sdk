"use client";
import { Address } from "viem";
import { useQuery } from "@tanstack/react-query";
import { graphql } from "@/generated/gql/whisk";
import { useWhiskSdkContext } from "@/provider";
import { IdentityResolver } from "../types";

const Avatar_IdentityQuery = graphql(/* GraphQL */ `
  query Avatar_IdentityQuery($address: String!, $resolverOrder: [IdentityResolverInput!]) {
    identity(address: $address, resolverOrder: $resolverOrder) {
      aggregate {
        avatar
      }
    }
  }
`);

export function useAvatar({ address, resolverOrder }: { address: Address; resolverOrder?: IdentityResolver[] }) {
  const { config, whiskClient } = useWhiskSdkContext();
  return useQuery({
    queryKey: ["identity", "avatar", resolverOrder, address],
    queryFn: async () =>
      await whiskClient?.request(Avatar_IdentityQuery, {
        address,
        resolverOrder: resolverOrder ?? config.identity?.resolverOrder,
      }),
    select: (data) => {
      return data?.identity?.aggregate.avatar;
    },
  });
}
