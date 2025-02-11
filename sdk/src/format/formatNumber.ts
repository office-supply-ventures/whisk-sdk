export interface FormatNumberParams {
  input: number | bigint;
  compact?: boolean;
  maxFractionDigits?: number;
  maxSignificantDigits?: number;
  forceSign?: boolean;
  unit?: "%" | "USD" | string;
}

export function formatNumber({
  input,
  compact,
  maxFractionDigits,
  maxSignificantDigits,
  forceSign,
  unit,
}: FormatNumberParams): string {
  const prefix = unit && unit != "%" ? (unit == "USD" ? "$" : unit == "Ξ" ? "Ξ" : "") : "";
  const postfix = unit && unit != "%" ? (unit != "USD" && unit != "Ξ" ? ` ${unit}` : "") : "";
  const formattedNumber = Intl.NumberFormat("en", {
    notation: (input > 9999 || input < -9999) && compact ? "compact" : "standard",
    maximumFractionDigits: maxFractionDigits ?? 2,
    maximumSignificantDigits: maxSignificantDigits,
    style: unit == "%" ? "percent" : "decimal",
    signDisplay: forceSign ? "exceptZero" : "auto",
  }).format(input);
  return (input < 0 ? "-" : "") + prefix + formattedNumber.replace("-", "") + postfix;
}
