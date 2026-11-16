import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/format";

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  children: (props: { id: string; "aria-invalid": boolean; "aria-describedby"?: string; className: string }) => ReactNode;
}

export const inputClass =
  "min-h-12 w-full rounded-lg border bg-linho/70 px-4 text-base transition-colors placeholder:text-pedra/60 hover:border-tinta/40 focus:border-tinta focus:bg-linho focus:outline-none aria-invalid:border-erro";

/** Campo de formulário com rótulo, dica e erro conectados por ARIA. */
export function Field({ id, label, error, hint, optional, className, children }: FieldProps) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between gap-2 text-[0.9375rem]">
        {label}
        {optional ? <span className="text-sm text-pedra">opcional</span> : null}
      </label>
      {children({ id, "aria-invalid": Boolean(error), "aria-describedby": describedBy, className: cn(inputClass, error ? "border-erro" : "border-tinta/20") })}
      {hint && !error ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-pedra">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-erro">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Select(props: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select {...props} className={cn(props.className, "cursor-pointer appearance-none bg-linho pr-10 text-tinta")} />
      <svg aria-hidden viewBox="0 0 12 8" className="pointer-events-none absolute top-1/2 right-4 h-2 w-3 -translate-y-1/2 fill-none stroke-current">
        <path d="M1 1.5 6 6.5l5-5" strokeWidth="1.3" />
      </svg>
    </div>
  );
}
