"use client";

// src/providers/counter-store-provider.tsx
"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
  type PageStore,
  createPageStore,
  defaultInitState,
} from "@/store/page-store";

export type PageStoreApi = ReturnType<typeof createPageStore>;

export const CounterPageContext = createContext<PageStoreApi | undefined>(
  undefined
);

export interface PageStoreProviderProps {
  children: ReactNode;
}

export const PageStoreProvider = ({ children }: PageStoreProviderProps) => {
  const storeRef = useRef<PageStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createPageStore(defaultInitState());
  }

  return (
    <CounterPageContext.Provider value={storeRef.current}>
      {children}
    </CounterPageContext.Provider>
  );
};

export const usePageStore = <T,>(selector: (store: PageStore) => T): T => {
  const counterStoreContext = useContext(CounterPageContext);

  if (!counterStoreContext) {
    throw new Error(`useCounterStore must be used within CounterStoreProvider`);
  }

  return useStore(counterStoreContext, selector);
};
