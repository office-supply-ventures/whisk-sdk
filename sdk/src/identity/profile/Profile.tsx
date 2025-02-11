"use client";
import { ComponentProps } from "react";
import { ProfileUi } from "./ProfileUi";
import { useProfileQuery } from "./useProfile";
import { IdentityResolver } from "../types";

interface ProfileProps extends Omit<ComponentProps<typeof ProfileUi>, "fragment"> {
  resolverOrder?: IdentityResolver[];
}

export function Profile({ address, resolverOrder, ...props }: ProfileProps) {
  const { data } = useProfileQuery({ address, resolverOrder });
  return <ProfileUi address={address} fragment={data} {...props} />;
}
