"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { THEME_EVENT } from "@/components/layout/Header";
import { useLightbox } from "@/components/providers/LightboxProvider";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { filterLabel, parseFilter, themeFor, type Filter } from "@/data/categories";
import type { GalleryItem, GallerySet } from "@/data/types";
import { Flip, gsap, ScrollTrigger, useGSAP } from "@/lib/animations/gsap";
import { pageReveal } from "@/lib/animations/page-reveal";
import { cn, prefersReducedMotion } from "@/lib/utils";
import { FilmStripControls } from "./FilmStripControls";
import { FilterBar } from "./FilterBar";
import { GalleryCard } from "./GalleryCard";
import { layouts } from "./layouts";

interface Props {
  id: string;
  set: GallerySet;
  /** Heading block rendered above the filters (server-rendered) */
  intro: ReactNode;
  /** Show the "View all work" footer (home page) */
  showViewAll?: boolean;
  className?: string;
}

type PendingFlip = { state: Flip.FlipState; height: number };

/** Mirrors `?category=` into the gallery: initial value instantly, back/forward with animation. */
function UrlFilterSync({ onChange }: { onChange: (filter: Filter, initial: boolean) => void }) {
  const params = useSearchParams();
  const value = parseFilter(params.get("category"));
  const first = useRef(true);
  useLayoutEffect(() => {
    onChange(value, first.current);
    first.current = false;
  }, [value, onChange]);
  return null;
}

export function FilterableGallery({ id, set, intro, showViewAll = false, className }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const filterRef = useRef<Filter>("all");
  const pending = useRef<PendingFlip | null>(null);
  const openLightbox = useLightbox();
  const listId = `${id}-list`;

  const counts = useMemo(
    () => Object.fromEntries(Object.entries(set.order).map(([k, v]) => [k, v.length])) as Record<Filter, number>,
    [set],
  );
  const byKey = useMemo(() => new Map(set.pool.map((item) => [item.key, item])), [set]);

  // Visible items first (in layout order), then everything hidden — same DOM nodes throughout.
  const { visible, ordered } = useMemo(() => {
    const keys = set.order[filter];
    const shown = keys.map((key) => byKey.get(key)!);
    const rest = set.pool.filter((item) => !keys.includes(item.key));
    return { visible: shown, ordered: [...shown, ...rest] };
  }, [filter, set, byKey]);

  const select = useCallback((next: Filter, { animate = true, push = false } = {}) => {
    if (next === filterRef.current) return;
    const list = listRef.current;
    if (animate && list && !prefersReducedMotion()) {
      pending.current = { state: Flip.getState(list.children), height: list.offsetHeight };
    }
    filterRef.current = next;
    setFilter(next);
    if (push) {
      const url = new URL(window.location.href);
      if (next === "all") url.searchParams.delete("category");
      else url.searchParams.set("category", next);
      window.history.pushState(null, "", `${url.pathname}${url.search}`);
    }
  }, []);

  const syncFromUrl = useCallback(
    (next: Filter, initial: boolean) => select(next, { animate: !initial }),
    [select],
  );

  // Scroll reveal for frames, once the page is visible. Cancelled by the first
  // filter change — from then on Flip's enter animation introduces new frames.
  const reveals = useRef<ScrollTrigger[]>([]);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const frames = gsap.utils.toArray<HTMLElement>(".g-frame", listRef.current);
      gsap.set(frames, { clipPath: "inset(100% 0% 0% 0%)" });
      return pageReveal.when(() => {
        reveals.current = ScrollTrigger.batch(frames, {
          start: "top 92%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut", stagger: 0.08 }),
        });
      });
    },
    { scope: listRef },
  );

  // Layout change: tween the theme, Flip every image into its new box.
  useGSAP(
    () => {
      window.dispatchEvent(new Event(THEME_EVENT));
      const list = listRef.current!;
      const flip = pending.current;
      pending.current = null;
      if (filter === "parties") list.scrollLeft = 0;

      if (!flip) {
        ScrollTrigger.refresh();
        return;
      }

      if (reveals.current.length) {
        reveals.current.forEach((t) => t.kill());
        reveals.current = [];
        const frames = list.querySelectorAll(".g-frame");
        gsap.killTweensOf(frames);
        gsap.set(frames, { clipPath: "none" });
      }

      const captions = list.querySelectorAll(".g-caption");
      gsap.set(captions, { opacity: 0 });
      gsap.fromTo(
        list,
        { height: flip.height },
        { height: list.offsetHeight, duration: 1.15, ease: "expo.inOut", clearProps: "height" },
      );
      Flip.from(flip.state, {
        duration: 1.15,
        ease: "expo.inOut",
        absolute: true,
        stagger: 0.012,
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.9, delay: 0.3, ease: "expo.out", stagger: 0.03 },
          ),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.5, ease: "power2.in" }),
        onComplete: () => {
          gsap.to(captions, { opacity: 1, duration: 0.7, ease: "power2.out", stagger: 0.02 });
          ScrollTrigger.refresh();
        },
      });
    },
    { dependencies: [filter], scope: listRef },
  );

  const onOpen = useCallback(
    (key: string) => {
      const index = visible.findIndex((item) => item.key === key);
      openLightbox(
        visible.map((item: GalleryItem) => ({
          photo: item.photo,
          title: item.project.title,
          meta: `${item.photo.caption} — ${item.project.location}, ${item.project.year}`,
        })),
        Math.max(0, index),
      );
    },
    [visible, openLightbox],
  );

  const theme = themeFor(filter);
  const themeVars = {
    "--g-bg": theme.bg,
    "--g-ink": theme.ink,
    "--g-muted": theme.muted,
    "--g-accent": theme.accent,
    "--g-accent-ink": theme.accentInk,
  } as CSSProperties;
  const layout = layouts[filter];

  return (
    <section
      ref={sectionRef}
      id={id}
      data-theme={filter === "parties" ? "dark" : "light"}
      className={cn("gallery-theme container-x", className)}
      style={themeVars}
    >
      <Suspense fallback={null}>
        <UrlFilterSync onChange={syncFromUrl} />
      </Suspense>

      {intro}

      <div className="sticky top-0 z-[55] -mx-[var(--gutter)] mb-10 border-b border-[color-mix(in_srgb,var(--g-ink)_14%,transparent)] bg-[var(--g-bg)] px-[var(--gutter)] md:mb-16">
        <FilterBar active={filter} counts={counts} onSelect={(f) => select(f, { push: true })} controls={listId} />
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {filterLabel(filter).toLowerCase()} images
      </p>

      <ul
        ref={listRef}
        id={listId}
        data-layout={filter}
        data-cursor={filter === "parties" ? "Drag" : undefined}
        className={cn("relative", layout.list)}
      >
        {ordered.map((item) => {
          const index = visible.indexOf(item);
          return (
            <GalleryCard
              key={item.key}
              item={item}
              layout={filter}
              index={index}
              slot={index >= 0 ? layout.slot(index, item.photo) : null}
              onOpen={onOpen}
            />
          );
        })}
      </ul>

      {filter === "parties" && <FilmStripControls listRef={listRef} />}

      {showViewAll && (
        <div className="mt-16 flex items-center justify-between gap-6 border-t border-[color-mix(in_srgb,var(--g-ink)_14%,transparent)] pt-8 md:mt-24">
          <p className="label hidden text-[var(--g-muted)] sm:block">A selection of {visible.length} frames</p>
          <TransitionLink
            href={filter === "all" ? "/work" : `/work?category=${filter}`}
            className="group flex items-center gap-4 font-serif text-h3"
          >
            <span className="u-link">View all {filter === "all" ? "work" : filterLabel(filter).toLowerCase()}</span>
            <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-2">
              →
            </span>
          </TransitionLink>
        </div>
      )}
    </section>
  );
}
