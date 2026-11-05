"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/animations/gsap";
import { useMediaQuery } from "@/lib/hooks";

/**
 * A small blend-mode dot that follows the pointer and blooms into a labelled
 * circle over anything marked `data-cursor="View"` (or any label).
 * Disabled for touch devices and reduced motion.
 */
export function Cursor() {
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const enabled = finePointer && !reducedMotion;
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const html = document.documentElement;
    html.classList.add("has-cursor");
    gsap.set([dot, ring], { xPercent: 0, yPercent: 0, opacity: 0 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.15, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.15, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.55, ease: "power3.out" });

    let label: string | null = null;
    let interactive = false;

    const apply = () => {
      gsap.to(ring, { scale: label ? 1 : 0, duration: 0.6, ease: "expo.out" });
      gsap.to(dot, { scale: label ? 0 : interactive ? 3.2 : 1, duration: 0.5, ease: "expo.out" });
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      gsap.to([dot, ring], { opacity: 1, duration: 0.3, overwrite: "auto" });
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const onOver = (e: Event) => {
      const target = e.target as Element | null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      const nextLabel = labelled?.dataset.cursor ?? null;
      const nextInteractive = !!target?.closest("a, button, [role='button'], label, select");
      if (nextLabel === label && nextInteractive === interactive) return;
      label = nextLabel;
      interactive = nextInteractive;
      if (label && labelRef.current) labelRef.current.textContent = label;
      apply();
    };

    const onLeaveWindow = () => gsap.to([dot, ring], { opacity: 0, duration: 0.3 });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);
    return () => {
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <span ref={labelRef} className="label">
          View
        </span>
      </div>
    </>
  );
}
