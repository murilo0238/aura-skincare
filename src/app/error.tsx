"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/button";

export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="shell flex min-h-[60svh] flex-col justify-center py-16">
      <p className="text-sm text-pedra">Algo não carregou</p>
      <h1 className="font-display text-display-l mt-3 max-w-[16ch]">Não foi possível exibir esta página.</h1>
      <p className="text-lead mt-6 max-w-md text-tinta/80">
        Tente carregar de novo. Se continuar, volte ao início: sua sacola fica salva neste navegador.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={() => retry()}>Tentar novamente</Button>
        <ButtonLink href="/" variant="outline">
          Voltar ao início
        </ButtonLink>
      </div>
    </section>
  );
}
