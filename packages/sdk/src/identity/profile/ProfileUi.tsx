"use client";
import { FragmentType, graphql, useFragment } from "@/generated/gql/whisk";
import { HTMLAttributes } from "react";
import { Address } from "viem";
import { AvatarUi } from "../avatar";
import { NameUi } from "../name";
import { CONFIG } from "@/config";
import { formatAddress } from "@/format";
import { cn } from "@/ui";
import { Skeleton } from "@/ui/skeleton";

const SOCIALS_IMAGE_BASE_URL = CONFIG.whiskServerUrl + "/static/img/social";

export const Profile_IdentityFragment = graphql(/* GraphQL */ `
  fragment Profile_IdentityFragment on Identity {
    aggregate {
      name
      avatar
      bio
      website
      x
      github
      discord
      telegram
    }
    ens {
      name
    }
    farcaster {
      name
    }
    nns {
      name
    }
    base {
      name
    }
    uni {
      name
    }
    lens {
      name
    }
    world {
      name
    }
  }
`);

interface ProfileUi extends HTMLAttributes<HTMLDivElement> {
  address: Address;
  fragment: FragmentType<typeof Profile_IdentityFragment> | undefined;
}

export function ProfileUi({ address, fragment, className, ...props }: ProfileUi) {
  const identity = useFragment(Profile_IdentityFragment, fragment);

  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl text-foreground overflow-hidden border drop-shadow bg-background w-full max-w-[360px]",
        className
      )}
      {...props}
    >
      <div className="flex flex-col items-center justify-center p-6 bg-muted gap-3 text-center">
        <AvatarUi address={address} avatar={identity?.aggregate.avatar} size={74} />
        <div>
          <NameUi address={address} name={identity?.aggregate.name} className="text-lg font-bold" />
          <span className="text-sm text-muted-foreground font-semibold">{formatAddress({ address })}</span>
        </div>
        {identity ? (
          <>
            <span>{identity.aggregate.bio}</span>
            {identity.aggregate.website && (
              <a
                href={identity.aggregate.website}
                target="_blank"
                className="rounded-full px-3 py-2 bg-black/5 text-sm text-foreground hover:bg-black/10 hover:text-foreground transition-colors"
              >
                {identity.aggregate.website}
              </a>
            )}
          </>
        ) : (
          <Skeleton className="w-full h-[70px]" />
        )}
      </div>
      <div className="px-[18px] py-6 flex flex-col items-start gap-2">
        <div className="text-sm font-semibold text-muted-foreground px-1.5">Connected accounts</div>
        <div className="flex flex-col w-full">
          <SocialItems fragment={fragment} />
        </div>
      </div>
    </div>
  );
}

function SocialItems({ fragment }: Pick<ProfileUi, "fragment">) {
  const identity = useFragment(Profile_IdentityFragment, fragment);

  if (!identity)
    return Array(3)
      .fill(0)
      .map((_, i) => <Skeleton className="w-full h-[36px] m-1" key={i} />);

  const socialItems: { logoPath: string; baseUrl?: string; username?: string | null }[] = [
    { logoPath: "/farcaster.png", baseUrl: "https://warpcast.com", username: identity.farcaster.name },
    { logoPath: "/lens.png", baseUrl: "https://hey.xyz/u", username: identity.lens.name },
    { logoPath: "/x.png", baseUrl: "https://x.com", username: identity.aggregate.x },
    { logoPath: "/base.png", baseUrl: "https://www.base.org/name", username: identity.base.name },
    { logoPath: "/uninames.png", baseUrl: undefined, username: identity.uni.name },
    { logoPath: "/ens.png", baseUrl: "https://app.ens.domains", username: identity.ens.name },
    { logoPath: "/discord.png", baseUrl: undefined, username: identity.aggregate.discord },
    { logoPath: "/telegram.png", baseUrl: undefined, username: identity.aggregate.telegram },
    { logoPath: "/github.png", baseUrl: "https://github.com", username: identity.aggregate.github },
    { logoPath: "/nns.png", baseUrl: "https://nns.xyz/domains", username: identity.nns.name },
    { logoPath: "/world-id.png", baseUrl: undefined, username: identity.world.name },
  ];

  return (
    <>
      {socialItems
        .filter((item) => item.username)
        .map((item, i) => (
          <a
            href={item.baseUrl ? `${item.baseUrl}/${item.username}` : undefined}
            target="_blank"
            key={i}
            className="flex gap-2 items-center text-foreground hover:text-foreground transition-colors hover:bg-black/10 rounded-lg px-1 py-1 w-full font-bold"
          >
            {/* TODO: allow user to pass in their custom image component in the provider */}
            <img
              src={`${SOCIALS_IMAGE_BASE_URL}/${item.logoPath}`}
              width={28}
              height={28}
              className="rounded-[6px] border shadow-inner"
              alt={item.logoPath.split(".")[0]}
            />
            <span>{item.username}</span>
          </a>
        ))}
    </>
  );
}
