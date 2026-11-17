"use client";

import { AnimatePresence, m } from "motion/react";
import { ChevronDown, Info } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { shippingCost, shippingOptions, type ShippingId } from "@/data/shipping";
import { cn, formatPrice, pluralize } from "@/lib/format";
import {
  emptyCheckout,
  formatCep,
  formatPhone,
  UFS,
  validateCheckout,
  validateField,
  type CheckoutErrors,
  type CheckoutValues,
} from "@/lib/validation";
import { detailLines, useCart, useCartHydrated, type DetailedLine } from "@/store/cart";
import { Field, Select } from "./field";
import { OrderSummaryLines, OrderTotals } from "./order-summary";

interface Confirmation {
  code: string;
  firstName: string;
  lines: DetailedLine[];
  subtotal: number;
  shipping: number;
  shippingLabel: string;
}

function DemoNotice() {
  return (
    <div className="flex gap-3 rounded-lg border border-rose-tinta/30 bg-rose-claro/25 p-4 text-sm leading-relaxed" role="note">
      <Info className="mt-0.5 size-4 shrink-0 text-rose-tinta" strokeWidth={1.6} aria-hidden />
      <p>
        <strong className="font-medium">Checkout demonstrativo.</strong> Nenhum pagamento é solicitado, nenhum pedido é
        processado e os dados digitados não são armazenados nem enviados: eles existem só nesta página.
      </p>
    </div>
  );
}

function ConfirmationView({ order }: { order: Confirmation }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, []);
  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-2xl py-6 lg:py-12"
    >
      <div className="relative isolate">
        <div aria-hidden className="aura-glow absolute -top-24 -left-24 -z-10 size-80 rounded-full opacity-70 [--aura:#d9a092]" />
        <p className="text-sm text-pedra">Pedido simulado {order.code}</p>
        <h1 ref={headingRef} tabIndex={-1} className="font-display text-display-l mt-3 focus:outline-none">
          Obrigado, {order.firstName}.
        </h1>
        <p className="text-lead mt-6 text-tinta/80">
          Seu pedido demonstrativo foi concluído. Como esta loja é uma demonstração, nada será cobrado nem enviado, e os
          dados de entrega já foram descartados.
        </p>
      </div>

      <div className="mt-10 bg-linho p-5 sm:p-8">
        <h2 className="font-display text-[1.6rem]">Resumo</h2>
        <OrderSummaryLines lines={order.lines} />
        <OrderTotals subtotal={order.subtotal} shipping={order.shipping} shippingLabel={order.shippingLabel} />
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/produtos">Voltar à coleção</ButtonLink>
        <ButtonLink href="/" variant="outline">
          Ir para o início
        </ButtonLink>
      </div>
    </m.div>
  );
}

export function CheckoutView() {
  const formId = useId();
  const hydrated = useCartHydrated();
  const lines = useCart((s) => s.lines);
  const clear = useCart((s) => s.clear);
  const [values, setValues] = useState<CheckoutValues>(emptyCheckout);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [shippingId, setShippingId] = useState<ShippingId>("padrao");
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [order, setOrder] = useState<Confirmation | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const submitTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Ao sair da página o componente desmonta e os dados digitados somem com ele.
  useEffect(() => () => clearTimeout(submitTimer.current), []);

  // Aviso do navegador ao fechar/recarregar com dados preenchidos e pedido não concluído.
  const dirty = !order && Object.values(values).some((v) => v.trim() !== "");
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const detailed = detailLines(lines);
  const subtotal = detailed.reduce((s, l) => s + l.totalCents, 0);
  const shipping = shippingCost(shippingId, subtotal);
  const shippingLabel = shippingOptions.find((o) => o.id === shippingId)?.label ?? "";
  const count = detailed.reduce((s, l) => s + l.quantity, 0);

  function set<K extends keyof CheckoutValues>(key: K, raw: string) {
    const value = key === "cep" ? formatCep(raw) : key === "telefone" ? formatPhone(raw) : raw;
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: validateField(key, value) }));
  }

  function blur(key: keyof CheckoutValues) {
    const error = validateField(key, values[key]);
    setErrors((e) => ({ ...e, [key]: error }));
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const found = validateCheckout(values);
    setErrors(found);
    const firstKey = Object.keys(found)[0] as keyof CheckoutValues | undefined;
    if (firstKey) {
      errorSummaryRef.current?.focus();
      return;
    }
    setStatus("submitting");
    submitTimer.current = setTimeout(() => {
      const code = `AURA-DEMO-${Math.floor(1000 + Math.random() * 9000)}`;
      setOrder({
        code,
        firstName: values.nome.trim().split(/\s+/)[0],
        lines: detailed,
        subtotal,
        shipping,
        shippingLabel,
      });
      // Descarta os dados pessoais e esvazia a sacola.
      setValues(emptyCheckout);
      clear();
      setStatus("idle");
      window.scrollTo({ top: 0 });
    }, 900);
  }

  if (order) return <ConfirmationView order={order} />;

  if (!hydrated) {
    return <div className="min-h-[50vh]" aria-busy="true" aria-label="Carregando sacola" />;
  }

  if (detailed.length === 0) {
    return (
      <div className="max-w-xl py-10 lg:py-16">
        <h1 className="font-display text-display-l">Sua sacola está vazia.</h1>
        <p className="text-lead mt-5 text-tinta/75">Adicione produtos da coleção para simular um pedido.</p>
        <ButtonLink href="/produtos" className="mt-8">
          Ver a coleção
        </ButtonLink>
      </div>
    );
  }

  const errorList = Object.entries(errors).filter(([, v]) => v) as [keyof CheckoutValues, string][];
  const fieldId = (k: keyof CheckoutValues) => `${formId}-${k}`;
  const text = (k: keyof CheckoutValues, extra: Partial<React.ComponentProps<"input">> = {}) => ({
    name: k,
    value: values[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(k, e.target.value),
    onBlur: () => blur(k),
    ...extra,
  });

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      {/* Resumo: colapsável no mobile, fixo na lateral no desktop */}
      <aside className="lg:order-2 lg:col-span-5" aria-labelledby={`${formId}-summary`}>
        <div className="bg-linho lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:p-8">
          <button
            type="button"
            onClick={() => setSummaryOpen((o) => !o)}
            aria-expanded={summaryOpen}
            aria-controls={`${formId}-summary-body`}
            className="flex min-h-14 w-full items-center justify-between gap-4 px-5 text-left lg:hidden"
          >
            <span className="flex items-center gap-2 text-[0.9375rem]">
              {summaryOpen ? "Ocultar resumo" : "Ver resumo"} ({pluralize(count, "item", "itens")})
              <ChevronDown className={cn("size-4 transition-transform duration-300", summaryOpen && "rotate-180")} strokeWidth={1.6} aria-hidden />
            </span>
            <span className="tabular font-display text-xl">{formatPrice(subtotal + shipping)}</span>
          </button>
          <div id={`${formId}-summary-body`} className={cn("px-5 pb-5 lg:block lg:p-0", summaryOpen ? "block" : "hidden")}>
            <h2 id={`${formId}-summary`} className="font-display hidden text-[1.6rem] lg:block">
              Resumo do pedido
            </h2>
            <OrderSummaryLines lines={detailed} />
            <OrderTotals subtotal={subtotal} shipping={shipping} shippingLabel={shippingLabel} />
          </div>
        </div>
      </aside>

      <form noValidate onSubmit={onSubmit} className="lg:order-1 lg:col-span-7" aria-labelledby={`${formId}-title`}>
        <h1 id={`${formId}-title`} className="font-display text-display-l">
          Checkout
        </h1>
        <div className="mt-6">
          <DemoNotice />
        </div>

        <div ref={errorSummaryRef} tabIndex={-1} className="focus:outline-none">
          {errorList.length ? (
            <div role="alert" className="mt-6 rounded-lg border border-erro/40 bg-erro/5 p-4 text-sm">
              <p className="font-medium text-erro">
                Revise {errorList.length === 1 ? "o campo destacado" : `os ${errorList.length} campos destacados`} para
                continuar.
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {errorList.map(([k, msg]) => (
                  <li key={k}>
                    <a href={`#${fieldId(k)}`} className="underline underline-offset-2">
                      {msg}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <fieldset className="mt-10">
          <legend className="font-display text-[1.7rem]">Contato</legend>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field id={fieldId("nome")} label="Nome completo" error={errors.nome} className="sm:col-span-2">
              {(p) => <input {...p} {...text("nome", { autoComplete: "name" })} />}
            </Field>
            <Field id={fieldId("email")} label="E-mail" error={errors.email}>
              {(p) => <input {...p} {...text("email", { type: "email", autoComplete: "email", inputMode: "email", spellCheck: false })} />}
            </Field>
            <Field id={fieldId("telefone")} label="Telefone" error={errors.telefone}>
              {(p) => <input {...p} {...text("telefone", { type: "tel", autoComplete: "tel-national", inputMode: "tel", placeholder: "(11) 91234-5678" })} />}
            </Field>
          </div>
        </fieldset>

        <fieldset className="mt-12">
          <legend className="font-display text-[1.7rem]">Entrega</legend>
          <div className="mt-5 grid gap-5 sm:grid-cols-6">
            <Field id={fieldId("cep")} label="CEP" error={errors.cep} hint="O CEP não é consultado." className="sm:col-span-2">
              {(p) => <input {...p} {...text("cep", { autoComplete: "postal-code", inputMode: "numeric", placeholder: "00000-000" })} />}
            </Field>
            <Field id={fieldId("endereco")} label="Endereço" error={errors.endereco} className="sm:col-span-4">
              {(p) => <input {...p} {...text("endereco", { autoComplete: "address-line1", placeholder: "Rua, avenida…" })} />}
            </Field>
            <Field id={fieldId("numero")} label="Número" error={errors.numero} className="sm:col-span-2">
              {(p) => <input {...p} {...text("numero", { autoComplete: "off", inputMode: "text" })} />}
            </Field>
            <Field id={fieldId("complemento")} label="Complemento" optional className="sm:col-span-4">
              {(p) => <input {...p} {...text("complemento", { autoComplete: "address-line2" })} />}
            </Field>
            <Field id={fieldId("bairro")} label="Bairro" error={errors.bairro} className="sm:col-span-2">
              {(p) => <input {...p} {...text("bairro", { autoComplete: "address-level3" })} />}
            </Field>
            <Field id={fieldId("cidade")} label="Cidade" error={errors.cidade} className="sm:col-span-2">
              {(p) => <input {...p} {...text("cidade", { autoComplete: "address-level2" })} />}
            </Field>
            <Field id={fieldId("uf")} label="Estado" error={errors.uf} className="sm:col-span-2">
              {(p) => (
                <Select
                  {...p}
                  name="uf"
                  autoComplete="address-level1"
                  value={values.uf}
                  onChange={(e) => {
                    set("uf", e.target.value);
                    setErrors((er) => ({ ...er, uf: validateField("uf", e.target.value) }));
                  }}
                  onBlur={() => blur("uf")}
                >
                  <option value="">Selecione</option>
                  {UFS.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          </div>
        </fieldset>

        <fieldset className="mt-12">
          <legend className="font-display text-[1.7rem]">Frete fictício</legend>
          <p className="mt-2 text-sm text-pedra">Valores e prazos ilustrativos. Nenhuma transportadora é consultada.</p>
          <div className="mt-5 grid gap-3">
            {shippingOptions.map((o) => {
              const cost = shippingCost(o.id, subtotal);
              return (
                <label
                  key={o.id}
                  className={cn(
                    "flex min-h-16 cursor-pointer items-center gap-4 rounded-lg border px-4 py-3 transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-rose-tinta",
                    shippingId === o.id ? "border-tinta bg-linho" : "border-tinta/20 hover:border-tinta/40",
                  )}
                >
                  <input
                    type="radio"
                    name="frete"
                    value={o.id}
                    checked={shippingId === o.id}
                    onChange={() => setShippingId(o.id)}
                    className="size-4 accent-cacau"
                  />
                  <span className="flex-1">
                    <span className="block text-[0.9375rem]">{o.label}</span>
                    <span className="block text-sm text-pedra">{o.detail}</span>
                  </span>
                  <span className="tabular text-[0.9375rem]">{cost === 0 ? "Grátis" : formatPrice(cost)}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="mt-12">
          <legend className="font-display text-[1.7rem]">Pagamento</legend>
          <p className="mt-3 max-w-lg text-[0.9375rem] text-tinta/80">
            Esta demonstração não solicita dados de cartão nem de qualquer outro meio de pagamento. Ao finalizar, você verá
            uma confirmação simulada.
          </p>
        </fieldset>

        <div className="mt-10 border-t border-tinta/15 pt-8">
          <div className="mb-5 flex items-baseline justify-between lg:hidden">
            <span className="text-[0.9375rem]">Total</span>
            <span className="tabular font-display text-[1.7rem]">{formatPrice(subtotal + shipping)}</span>
          </div>
          <Button type="submit" disabled={status === "submitting"} className="w-full sm:w-auto sm:px-10" aria-describedby={`${formId}-final`}>
            <AnimatePresence mode="wait" initial={false}>
              <m.span key={status} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {status === "submitting" ? "Finalizando…" : "Finalizar pedido demonstrativo"}
              </m.span>
            </AnimatePresence>
          </Button>
          <p id={`${formId}-final`} className="mt-3 text-sm text-pedra">
            Nenhum pedido será processado e nenhum valor será cobrado.
          </p>
        </div>
      </form>
    </div>
  );
}
