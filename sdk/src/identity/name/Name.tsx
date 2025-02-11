"use client";
import { ComponentProps } from "react";
import { NameUi } from "./NameUi";
import { useName } from "./useName";
import { IdentityResolver } from "../types";

interface NameProps extends Omit<ComponentProps<typeof NameUi>, "name"> {
  resolverOrder?: IdentityResolver[];
}

export function Name({ address, resolverOrder, ...props }: NameProps) {
  const { data: name } = useName({ address, resolverOrder });
  return <NameUi address={address} name={name} {...props} />;
}
