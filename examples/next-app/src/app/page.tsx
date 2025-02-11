"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Name, Avatar, useName, useAvatar } from "@paperclip-labs/whisk-sdk/identity";
import { zeroAddress } from "viem";

export default function Home() {
  const { address } = useAccount();

  const { data: name } = useName({ address: address ?? zeroAddress });
  const { data: avatar } = useAvatar({ address: address ?? zeroAddress });
  // const { data: profile } = useProfile({ address: address ?? zeroAddress });

  return (
    <div className="flex flex-col w-full p-4 items-center">
      <ConnectButton />

      {address && (
        <>
          <div className="flex gap-2 p-4 items-center">
            <Avatar address={address} size={32} />
            <Name address={address} />
          </div>
          {/* <Profile address={address} /> */}
        </>
      )}
      {name}
      {avatar}
      {/* {JSON.stringify(profile)} */}
    </div>
  );
}
