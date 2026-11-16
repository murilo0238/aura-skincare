import type { Moment } from "./products";

export interface RoutineStep {
  slug: string;
  gesture: string;
  note: string;
}

export interface Routine {
  moment: Moment;
  label: string;
  intro: string;
  steps: RoutineStep[];
}

export const routines: Routine[] = [
  {
    moment: "manha",
    label: "Manhã",
    intro: "Quatro gestos curtos, para começar o dia com a pele limpa, confortável e pronta.",
    steps: [
      { slug: "cleanse", gesture: "Limpar", note: "Espuma leve, enxágue morno." },
      { slug: "hydrate", gesture: "Preparar", note: "Três gotas, pressionadas." },
      { slug: "balance", gesture: "Hidratar", note: "Uma dose, de dentro para fora." },
      { slug: "protect", gesture: "Concluir", note: "Por último, em quantidade generosa." },
    ],
  },
  {
    moment: "noite",
    label: "Noite",
    intro: "Menos produtos, mais tempo. Três gestos lentos para encerrar o dia.",
    steps: [
      { slug: "cleanse", gesture: "Limpar", note: "Retire o dia com calma." },
      { slug: "hydrate", gesture: "Preparar", note: "Gotas sobre a pele ainda úmida." },
      { slug: "restore", gesture: "Envolver", note: "Aqueça entre as mãos antes de aplicar." },
    ],
  },
];
