import { Address } from "viem";

interface FormatAddressParams {
  address: Address;
}

export function formatAddress({ address }: FormatAddressParams): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
