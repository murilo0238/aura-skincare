"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/format";
import { MAX_QUANTITY } from "@/store/cart";

interface QuantityStepperProps {
  value: number;
  onChange: (next: number) => void;
  label: string;
  size?: "sm" | "md";
  className?: string;
}

export function QuantityStepper({ value, onChange, label, size = "md", className }: QuantityStepperProps) {
  const btn = cn(
    "inline-flex items-center justify-center rounded-full transition-colors hover:bg-tinta/5 disabled:opacity-30 disabled:hover:bg-transparent",
    size === "sm" ? "size-9" : "size-11",
  );
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex items-center rounded-full border border-tinta/20",
        size === "sm" ? "h-10 px-0.5" : "h-12 px-0.5",
        className,
      )}
    >
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Diminuir quantidade"
      >
        <Minus className="size-3.5" strokeWidth={1.6} aria-hidden />
      </button>
      <output className={cn("tabular text-center", size === "sm" ? "w-6 text-sm" : "w-8")} aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_QUANTITY}
        aria-label="Aumentar quantidade"
      >
        <Plus className="size-3.5" strokeWidth={1.6} aria-hidden />
      </button>
    </div>
  );
}
