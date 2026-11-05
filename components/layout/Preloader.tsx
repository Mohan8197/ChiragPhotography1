"use client";

import { useRef, useState } from "react";
import { studio } from "@/data/site";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { pageReveal } from "@/lib/animations/page-reveal";
import { startScroll } from "@/lib/scroll";
import { prefersReducedMotion } from "@/lib/utils";

/** Matches the CSS counter animation in globals.css (.pre-count). */
const COUNT_MS = 1300;
/** Never hold the page longer than this (ms since navigation start). */
const MAX_WAIT_MS = 2600;

/** Resolves when `ms` have passed since navigation start. */
const untilElapsed = (ms: number) =>
  new Promise((done) => setTimeout(done, Math.max(0, ms - performance.now())));

/** Fonts and the page's critical (LCP) image. */
function assetsReady(): Promise<unknown> {
  const images = [...document.querySelectorAll<HTMLImageElement>("img[data-critical]")].map((img) =>
    img.complete ? Promise.resolve() : new Promise((done) => img.addEventListener("load", done, { once: true })),
  );
  return Promise.all([document.fonts.ready, ...images]);
}

/**
 * First-load counter (00 → 100) that lifts like a curtain into the page.
 * The count runs in CSS from the very first paint; JS only lifts the curtain
 * once the count, fonts and hero image are ready.
 */
export function Preloader() {
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current!;
      const finish = () => {
        document.documentElement.classList.remove("is-loading");
        startScroll();
        pageReveal.show();
      };

      if (prefersReducedMotion()) {
        finish();
        gsap.to(root, { autoAlpha: 0, duration: 0.4, onComplete: () => setDone(true) });
        return;
      }

      let cancelled = false;
      Promise.all([untilElapsed(COUNT_MS + 150), Promise.race([assetsReady(), untilElapsed(MAX_WAIT_MS)])]).then(
        () => {
          if (cancelled) return;
          gsap
            .timeline()
            .to("[data-pre-line]", { yPercent: -110, duration: 0.6, ease: "expo.in", stagger: 0.04 })
            .add(finish, "-=0.15")
            .to(root, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "expo.inOut" }, "<")
            .add(() => setDone(true));
        },
      );
      return () => {
        cancelled = true;
      };
    },
    { scope: rootRef },
  );

  if (done) return null;

  return (
    <div
      ref={rootRef}
      className="preloader fixed inset-0 z-[110] flex flex-col justify-between bg-paper text-ink container-x py-6 md:py-8"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <p className="sr-only" role="status">
        Loading {studio.name}
      </p>
      <div className="flex items-start justify-between" aria-hidden="true">
        <span className="overflow-hidden">
          <span data-pre-line className="pre-line label block">
            Luxury event photography
          </span>
        </span>
        <span className="overflow-hidden">
          <span data-pre-line className="pre-line label block text-stone-deep">
            Bengaluru · Weddings & Events
          </span>
        </span>
      </div>

      <div aria-hidden="true">
        <div className="flex items-end justify-between gap-6">
          {/* Visible from the first frame: the page's first (and largest) contentful paint. */}
          <div className="overflow-hidden">
            <p data-pre-line className="font-serif text-mega">
              Chirag
              <br />
              <em className="italic">Vance</em>
            </p>
          </div>
          <span className="overflow-hidden">
            <span data-pre-line className="pre-line block font-serif text-h2 leading-none tabular-nums">
              <span className="pre-count" />
            </span>
          </span>
        </div>
        <span className="mt-6 block h-px w-full bg-ink/15">
          <span className="pre-bar block h-full w-full bg-champagne" />
        </span>
      </div>
    </div>
  );
}
