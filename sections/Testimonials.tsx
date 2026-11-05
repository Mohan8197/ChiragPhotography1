"use client";

import { useEffect, useRef, useState } from "react";
import { testimonials } from "@/data/site";
import { cn, pad, prefersReducedMotion } from "@/lib/utils";

const DURATION = 7000;

/** Large serif quotes that slowly fade from one to the next. */
export function Testimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const total = testimonials.length;
  const running = !paused && !hovered;

  useEffect(() => {
    if (!running || prefersReducedMotion()) return;
    const id = window.setTimeout(() => setActive((i) => (i + 1) % total), DURATION);
    return () => window.clearTimeout(id);
  }, [active, running, total]);

  const go = (dir: 1 | -1) => setActive((i) => (i + dir + total) % total);

  return (
    <section
      ref={rootRef}
      data-theme="light"
      aria-roledescription="carousel"
      aria-label="Client testimonials"
      className="bg-bone container-x py-[16vh]"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
    >
      <div className="grid-12 gap-y-10">
        <p className="label col-span-12 text-stone-deep md:col-span-3">(06) — Kind words</p>
        <div className="col-span-12 md:col-span-9">
          <div className="grid" aria-live={running ? "off" : "polite"}>
            {testimonials.map((t, i) => (
              <figure
                key={t.author}
                aria-hidden={i !== active}
                className={cn(
                  "[grid-area:1/1] transition-[opacity,transform,visibility] duration-1000 ease-[var(--ease-out-3)]",
                  i === active ? "visible translate-y-0 opacity-100" : "invisible translate-y-4 opacity-0",
                )}
              >
                <blockquote className="font-serif text-quote italic">“{t.quote}”</blockquote>
                <figcaption className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span aria-hidden="true" className="h-px w-10 bg-champagne" />
                  <span className="label">{t.author}</span>
                  <span className="label text-stone-deep">
                    {t.event} · {t.place}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-14 flex items-center gap-6">
            <button type="button" onClick={() => go(-1)} className="label u-link" aria-label="Previous testimonial">
              Previous
            </button>
            <span className="label tabular-nums text-stone-deep">
              {pad(active + 1)} / {pad(total)}
            </span>
            <button type="button" onClick={() => go(1)} className="label u-link" aria-label="Next testimonial">
              Next
            </button>
            <span className="relative h-px flex-1 overflow-hidden bg-ink/15" aria-hidden="true">
              <span
                key={active}
                className="absolute inset-0 origin-left bg-champagne"
                style={{
                  animation: `hero-progress ${DURATION}ms linear forwards`,
                  animationPlayState: running ? "running" : "paused",
                }}
              />
            </span>
            <button type="button" onClick={() => setPaused((p) => !p)} className="label u-link">
              {paused ? "Play" : "Pause"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
