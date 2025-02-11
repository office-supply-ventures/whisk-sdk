"use client";
import { cn } from "@/ui";
import clsx from "clsx";
import { HTMLAttributes, useEffect, useState } from "react";
import { Address } from "viem";

function getLinearGradientForAddress(address: Address) {
  const addr = address.slice(2, 10);
  const seed = parseInt(addr, 16);
  const number = Math.ceil(seed % 0xffffff);
  return `linear-gradient(45deg, #${number.toString(16).padStart(6, "0")}, #FFFFFF)`;
}

interface AvatarUiProps extends HTMLAttributes<HTMLDivElement> {
  address: Address;
  avatar?: string | null;
  size: number;
}

export function AvatarUi({ address, size, avatar, className, ...props }: AvatarUiProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset if address or avatar changes
  useEffect(() => {
    setIsLoaded(false);
  }, [address, avatar]);

  return (
    <div
      className={cn("relative rounded-full overflow-hidden border border-black/10 flex-shrink-0", className)}
      style={{
        width: size,
        height: size,
      }}
      {...props}
    >
      <div className="w-full h-full absolute inset-0" style={{ background: getLinearGradientForAddress(address) }} />
      {avatar && (
        <img
          src={avatar}
          alt=""
          width={size}
          height={size}
          className={clsx(
            "absolute left-0 top-0 transition-opacity duration-300 w-full h-full",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setIsLoaded(true)}
          onError={({ currentTarget }) => currentTarget.remove()}
        />
      )}
    </div>
  );
}
