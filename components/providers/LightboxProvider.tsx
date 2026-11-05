"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { LightboxItem } from "@/data/types";

// Loaded on first open — keeps the viewer out of the initial bundle.
const Lightbox = dynamic(() => import("@/components/lightbox/Lightbox"), { ssr: false });

type OpenLightbox = (items: LightboxItem[], index: number) => void;

const LightboxContext = createContext<OpenLightbox>(() => {});

export const useLightbox = () => useContext(LightboxContext);

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ items: LightboxItem[]; index: number } | null>(null);

  const open = useCallback<OpenLightbox>((items, index) => setState({ items, index }), []);
  const close = useCallback(() => setState(null), []);

  return (
    <LightboxContext value={open}>
      {children}
      {state && <Lightbox items={state.items} startIndex={state.index} onClose={close} />}
    </LightboxContext>
  );
}
