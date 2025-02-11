"use client";
import { Address } from "viem";
import { useQuery } from "@tanstack/react-query";
import { graphql, useFragment } from "@/generated/gql/whisk";
import { Profile_IdentityFragment } from "./ProfileUi";
import { useWhiskSdkContext } from "@/provider";
import { IdentityResolver } from "../types";

const Profile_IdentityQuery = graphql(/* GraphQL */ `
  query Profile_IdentityQuery($address: String!, $resolverOrder: [IdentityResolverInput!]) {
    identity(address: $address, resolverOrder: $resolverOrder) {
      ...Profile_IdentityFragment
    }
  }
`);

export function useProfileQuery({ address, resolverOrder }: { address: Address; resolverOrder?: IdentityResolver[] }) {
  const { config, whiskClient } = useWhiskSdkContext();
  return useQuery({
    queryKey: ["identity", "profile", resolverOrder, address],
    queryFn: async () =>
      await whiskClient?.request(Profile_IdentityQuery, {
        address,
        resolverOrder: resolverOrder ?? config.identity?.resolverOrder,
      }),
    select: (data) => {
      return data?.identity;
    },
  });
}

export function useProfile({ address, resolverOrder }: { address: Address; resolverOrder?: IdentityResolver[] }) {
  const query = useProfileQuery({ address, resolverOrder });
  return {
    ...query,
    data: query.data ? useFragment(Profile_IdentityFragment, query.data) : undefined,
  };
}
