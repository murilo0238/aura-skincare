"use client";

import { create } from "zustand";

type Panel = "cart" | "menu" | "search" | null;

interface UiState {
  panel: Panel;
  /** Último produto adicionado — usado para o destaque no carrinho. */
  lastAdded: { slug: string; at: number } | null;
  open: (panel: Exclude<Panel, null>) => void;
  close: () => void;
  notifyAdded: (slug: string) => void;
}

export const useUi = create<UiState>()((set) => ({
  panel: null,
  lastAdded: null,
  open: (panel) => set({ panel }),
  close: () => set({ panel: null }),
  notifyAdded: (slug) => {
    const at = Date.now();
    set({ lastAdded: { slug, at }, panel: "cart" });
    setTimeout(() => {
      if (useUi.getState().lastAdded?.at === at) set({ lastAdded: null });
    }, 2500);
  },
}));
