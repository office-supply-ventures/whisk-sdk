"use client";
import { AvatarUi } from "./AvatarUi";
import { ComponentProps } from "react";
import { useAvatar } from "./useAvatar";
import { IdentityResolverInput } from "@/generated/gql/whisk/graphql";

interface AvatarProps extends Omit<ComponentProps<typeof AvatarUi>, "fragment"> {
  resolverOrder?: IdentityResolverInput[];
}

export function Avatar({ address, resolverOrder, ...props }: AvatarProps) {
  const { data: avatar } = useAvatar({ address, resolverOrder });
  return <AvatarUi address={address} avatar={avatar} {...props} />;
}
