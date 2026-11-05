"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "@/lib/animations/gsap";
import { hasFinePointer } from "@/lib/utils";

/**
 * Progress, prev/next and mouse drag-to-scroll for the Parties film strip.
 * Touch devices swipe the strip natively (with scroll-snap).
 */
export function FilmStripControls({ listRef }: { listRef: RefObject<HTMLUListElement | null> }) {
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const strip = listRef.current;
    if (!strip) return;

    const update = () => {
      const max = strip.scrollWidth - strip.clientWidth;
      gsap.set(progressRef.current, { scaleX: max > 0 ? Math.max(0.04, strip.scrollLeft / max) : 1 });
    };
    update();
    strip.addEventListener("scroll", update, { passive: true });

    // Drag to scroll with a mouse
    let startX = 0;
    let startLeft = 0;
    let dragging = false;
    let moved = false;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !hasFinePointer()) return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startLeft = strip.scrollLeft;
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      strip.scrollLeft = startLeft - dx;
    };
    const up = () => (dragging = false);
    // Swallow the click that ends a drag so it doesn't open the lightbox
    const click = (e: MouseEvent) => {
      if (moved) {
        e.stopPropagation();
        e.preventDefault();
        moved = false;
      }
    };
    strip.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    strip.addEventListener("click", click, true);

    return () => {
      strip.removeEventListener("scroll", update);
      strip.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      strip.removeEventListener("click", click, true);
    };
  }, [listRef]);

  const step = (dir: 1 | -1) => {
    const strip = listRef.current;
    strip?.scrollBy({ left: dir * strip.clientWidth * 0.7, behavior: "smooth" });
  };

  return (
    <div className="mt-2 flex items-center gap-6">
      <span className="relative h-px flex-1 bg-[color-mix(in_srgb,var(--g-ink)_20%,transparent)]">
        <span ref={progressRef} className="absolute inset-0 origin-left bg-[var(--g-accent)]" />
      </span>
      <div className="flex gap-2">
        {([-1, 1] as const).map((dir) => (
          <button
            key={dir}
            type="button"
            onClick={() => step(dir)}
            aria-label={dir < 0 ? "Scroll film strip back" : "Scroll film strip forward"}
            className="grid size-12 place-items-center rounded-full border border-[color-mix(in_srgb,var(--g-ink)_30%,transparent)] transition-colors duration-500 hover:border-[var(--g-accent)] hover:bg-[var(--g-accent)] hover:text-charcoal"
          >
            <span aria-hidden="true">{dir < 0 ? "←" : "→"}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
