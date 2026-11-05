"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { FILTERS, filterLabel, type Filter } from "@/data/categories";
import { gsap } from "@/lib/animations/gsap";
import { pad, prefersReducedMotion } from "@/lib/utils";

interface Props {
  active: Filter;
  counts: Record<Filter, number>;
  onSelect: (filter: Filter) => void;
  controls: string;
}

/** Filter toggles with a sliding accent underline and per-filter counts. */
export function FilterBar({ active, counts, onSelect, controls }: Props) {
  const barRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const placed = useRef(false);

  useLayoutEffect(() => {
    const bar = barRef.current!;
    const place = (animate: boolean) => {
      const button = bar.querySelector<HTMLElement>(`[data-filter="${active}"]`);
      if (!button) return;
      const props = { x: button.offsetLeft, scaleX: button.offsetWidth / 100 };
      if (animate && !prefersReducedMotion()) gsap.to(indicatorRef.current, { ...props, duration: 0.9, ease: "expo.out" });
      else gsap.set(indicatorRef.current, props);
      // Keep the active filter in view on narrow screens
      const left = button.offsetLeft - bar.clientWidth / 2 + button.offsetWidth / 2;
      bar.scrollTo({ left, behavior: animate ? "smooth" : "auto" });
    };
    place(placed.current);
    placed.current = true;
  }, [active]);

  useEffect(() => {
    const bar = barRef.current!;
    const observer = new ResizeObserver(() => {
      const button = bar.querySelector<HTMLElement>(`[data-filter="${active}"]`);
      if (button) gsap.set(indicatorRef.current, { x: button.offsetLeft, scaleX: button.offsetWidth / 100 });
    });
    observer.observe(bar);
    return () => observer.disconnect();
  }, [active]);

  return (
    <div
      ref={barRef}
      role="group"
      aria-label="Filter by event type"
      className="no-scrollbar relative -mx-[var(--gutter)] flex items-baseline gap-6 overflow-x-auto px-[var(--gutter)] md:mx-0 md:gap-9 md:px-0"
    >
      <span className="label hidden shrink-0 pr-2 text-[var(--g-muted)] lg:inline">Filter by event —</span>
      {FILTERS.map((filter) => (
        <button
          key={filter}
          type="button"
          data-filter={filter}
          aria-pressed={filter === active}
          aria-controls={controls}
          onClick={() => onSelect(filter)}
          className="shrink-0 py-4 font-serif text-[clamp(1.375rem,2.2vw,2.25rem)] leading-none whitespace-nowrap text-[var(--g-muted)] transition-colors duration-500 hover:text-[var(--g-ink)] aria-pressed:text-[var(--g-ink)] aria-pressed:italic"
        >
          {filterLabel(filter)}
          <sup className="ml-1 align-super font-sans text-[0.6875rem] not-italic tabular-nums">{pad(counts[filter])}</sup>
        </button>
      ))}
      <span
        ref={indicatorRef}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-1 left-0 h-[2px] w-[100px] origin-left bg-[var(--g-accent)]"
      />
    </div>
  );
}
