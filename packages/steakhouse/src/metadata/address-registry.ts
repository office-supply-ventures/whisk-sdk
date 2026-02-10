import { getAddress } from "viem"
import { arbitrum, base, mainnet } from "viem/chains"
import type { Address } from "./types.js"

export interface ChainAddresses {
  readonly boxFactory?: Address
}

const addressesRegistry: Record<number, ChainAddresses> = {
  [mainnet.id]: {
    boxFactory: getAddress("0xcF23d316e7C415a70836Ec9E68568C3cD82EBFc4"),
  },
  [base.id]: {
    boxFactory: getAddress("0x846365F9A09aeB7005127C6060876C82F7F70c0b"),
  },
  [arbitrum.id]: {
    boxFactory: getAddress("0x72576c537e25AeCb3026E5c8EF4B90436E22A333"),
  },
}

export function getChainAddresses(chainId: number): ChainAddresses {
  return addressesRegistry[chainId] ?? {}
}
