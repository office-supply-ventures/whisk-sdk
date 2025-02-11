"use client";
import { formatAddress } from "@/format";
import { cn } from "@/ui";
import { motion, AnimatePresence } from "motion/react";
import { HTMLAttributes } from "react";
import { Address } from "viem";

interface NameUiProps extends HTMLAttributes<HTMLDivElement> {
  address: Address;
  name?: string | null;
}

export function NameUi({ address, name, className, ...props }: NameUiProps) {
  return (
    <div className={cn("relative", className)} {...props}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={name ? "loaded" : "loading"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", duration: 0.3, bounce: 0 }}
          className={cn("text-ellipsis overflow-hidden whitespace-nowrap")}
        >
          {name ?? formatAddress({ address })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
