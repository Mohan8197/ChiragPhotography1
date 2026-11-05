"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { cn, hasFinePointer, prefersReducedMotion } from "@/lib/utils";

interface Props {
  children: ReactNode;
  className?: string;
  /** How far the element follows the pointer (0–1) */
  strength?: number;
}

/** Pulls its child gently toward the pointer, then settles back. */
export function Magnetic({ children, className, strength = 0.35 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !hasFinePointer() || prefersReducedMotion()) return;

      const xTo = gsap.quickTo(el, "x", { duration: 0.9, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.9, ease: "power3.out" });
      let rect = el.getBoundingClientRect();

      const enter = () => {
        gsap.set(el, { x: 0, y: 0 });
        rect = el.getBoundingClientRect();
      };
      const move = (e: PointerEvent) => {
        xTo((e.clientX - (rect.left + rect.width / 2)) * strength);
        yTo((e.clientY - (rect.top + rect.height / 2)) * strength);
      };
      const leave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener("pointerenter", enter);
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointerenter", enter);
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={cn("inline-block", className)}>
      {children}
    </span>
  );
}
