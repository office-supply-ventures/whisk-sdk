import { BigIntString } from "../types";
import { formatNumber, FormatNumberParams } from "./formatNumber";
import { formatUnits } from "viem";

interface FormatTokenAmountParams extends Omit<FormatNumberParams, "input"> {
  tokenAmount: bigint | BigIntString;
  tokenDecimals: number;
}

export function formatTokenAmount({ tokenAmount, tokenDecimals, ...rest }: FormatTokenAmountParams): string {
  const tokensFormatted = formatUnits(BigInt(tokenAmount), tokenDecimals);
  return formatNumber({ input: Number(tokensFormatted), ...rest });
}
