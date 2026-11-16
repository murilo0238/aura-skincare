"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/format";
import { isValidEmail } from "@/lib/validation";

type Status = "idle" | "error" | "done";

/** Inscrição simulada: nada é enviado nem armazenado. */
export function Newsletter() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setStatus("error");
      return;
    }
    setEmail("");
    setStatus("done");
  }

  return (
    <section aria-labelledby={`${id}-title`} className="border-t border-tinta/10 bg-calcario/60">
      <div className="shell grid gap-10 py-20 lg:grid-cols-12 lg:items-end lg:gap-8 lg:py-28">
        <div className="lg:col-span-6">
          <h2 id={`${id}-title`} className="font-display text-display-m">
            Cartas da AURA
          </h2>
          <p className="mt-4 max-w-md text-tinta/80">
            Uma carta por estação, com rituais, texturas e novidades da linha.
          </p>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          {status === "done" ? (
            <div role="status" className="border-l-2 border-rose-tinta py-2 pl-5">
              <p className="font-display text-[1.6rem] leading-tight">Inscrição simulada com sucesso.</p>
              <p className="mt-2 text-sm text-pedra">
                Esta é uma demonstração: nenhum e-mail foi enviado ou armazenado.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-3 min-h-11 text-sm underline decoration-current/30 underline-offset-4 hover:decoration-current"
              >
                Fazer outra inscrição
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={onSubmit}>
              <label htmlFor={`${id}-email`} className="text-[0.9375rem]">
                Seu e-mail
              </label>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <input
                  id={`${id}-email`}
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  spellCheck={false}
                  placeholder="nome@exemplo.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  aria-invalid={status === "error"}
                  aria-describedby={`${id}-hint ${status === "error" ? `${id}-error` : ""}`}
                  className={cn(
                    "min-h-12 min-w-0 flex-1 rounded-full border bg-linho px-6 text-base placeholder:text-pedra/70 focus:border-tinta focus:outline-none",
                    status === "error" ? "border-erro" : "border-tinta/20",
                  )}
                />
                <Button type="submit">Inscrever</Button>
              </div>
              {status === "error" ? (
                <p id={`${id}-error`} className="mt-2 text-sm text-erro" role="alert">
                  Digite um e-mail válido, como nome@exemplo.com.
                </p>
              ) : null}
              <p id={`${id}-hint`} className="mt-3 text-sm text-pedra">
                Demonstração: o e-mail não é enviado nem armazenado.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
