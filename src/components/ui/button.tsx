import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/format";

/**
 * Botões AURA. Variantes explícitas (sem props booleanas):
 * - solid: ação principal (cacau sobre alabastro)
 * - outline: ação secundária
 * - light: ação principal sobre fundos escuros
 */
const base =
  "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-7 text-[0.9375rem] font-medium tracking-[0.01em] transition-[background-color,color,border-color,transform] duration-300 ease-(--ease-aura) active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 select-none";

const variants = {
  solid: "bg-cacau text-marfim hover:bg-cacau-claro",
  outline: "border border-tinta/25 text-tinta hover:border-tinta hover:bg-tinta/[0.03]",
  light: "bg-marfim text-cacau hover:bg-white",
} as const;

export type ButtonVariant = keyof typeof variants;

export function buttonClass(variant: ButtonVariant = "solid", className?: string) {
  return cn(base, variants[variant], className);
}

export function Button({
  variant = "solid",
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant }) {
  return <button type={type} className={buttonClass(variant, className)} {...props} />;
}

export function ButtonLink({
  variant = "solid",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return <Link className={buttonClass(variant, className)} {...props} />;
}

/** Link de texto com sublinhado que se desenha no hover. */
export function TextLink({ className, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "group/link relative inline-flex items-center gap-1.5 text-[0.9375rem] font-medium underline decoration-current/30 decoration-1 underline-offset-[6px] transition-[text-decoration-color] duration-300 hover:decoration-current",
        className,
      )}
      {...props}
    />
  );
}
