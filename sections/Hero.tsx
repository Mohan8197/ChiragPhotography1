"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { categories } from "@/data/categories";
import type { HeroSlide } from "@/data/projects";
import { studio } from "@/data/site";
import { gsap, SplitText, useGSAP } from "@/lib/animations/gsap";
import { pageReveal } from "@/lib/animations/page-reveal";
import { scrollTo } from "@/lib/scroll";
import { pad, prefersReducedMotion } from "@/lib/utils";

const SLIDE_MS = 6500;

export function Hero({ slides }: { slides: HeroSlide[] }) {
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  // Only the first (LCP) slide renders until the page is revealed.
  const [mounted, setMounted] = useState(1);
  const playing = useRef(false);

  useGSAP(
    () => {
      const root = rootRef.current!;
      const reduce = prefersReducedMotion();
      const title = root.querySelector<HTMLElement>("[data-hero-title]")!;

      if (reduce) {
        return pageReveal.when(() => setMounted(slides.length));
      }

      let revealed = false;
      let titleTween: gsap.core.Tween | undefined;
      SplitText.create(title, {
        type: "lines, chars",
        mask: "lines",
        linesClass: "split-line",
        aria: "none",
        autoSplit: true,
        onSplit(self) {
          titleTween = gsap.fromTo(
            self.chars,
            { yPercent: 118 },
            { yPercent: 0, duration: 1.5, ease: "expo.out", stagger: 0.045, paused: !revealed },
          );
          return titleTween;
        },
      });

      gsap.set("[data-hero-fade]", { autoAlpha: 0, y: 24 });
      const intro = gsap
        .timeline({ paused: true })
        .fromTo("[data-hero-media]", { scale: 1.18 }, { scale: 1, duration: 2.4, ease: "expo.out" })
        .to("[data-hero-fade]", { autoAlpha: 1, y: 0, duration: 1.2, ease: "power3.out", stagger: 0.1 }, 0.7);

      // Scroll: imagery sinks, type lifts away.
      gsap.to("[data-hero-parallax]", {
        yPercent: 16,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-hero-content]", {
        yPercent: -22,
        autoAlpha: 0.15,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });

      return pageReveal.when(() => {
        revealed = true;
        titleTween?.play();
        intro.play();
        playing.current = true;
        setMounted(slides.length);
      });
    },
    { scope: rootRef },
  );

  // Slow crossfade through event types; pauses off-screen and in background tabs.
  useEffect(() => {
    if (slides.length < 2 || prefersReducedMotion()) return;
    let inView = true;
    const observer = new IntersectionObserver(([entry]) => (inView = entry.isIntersecting));
    observer.observe(rootRef.current!);
    const id = window.setInterval(() => {
      if (playing.current && inView && document.visibilityState === "visible") {
        setActive((i) => (i + 1) % slides.length);
      }
    }, SLIDE_MS);
    return () => {
      window.clearInterval(id);
      observer.disconnect();
    };
  }, [slides.length]);

  const current = slides[active];

  return (
    <section
      ref={rootRef}
      data-theme="dark"
      className="relative h-[100svh] min-h-[600px] overflow-hidden bg-charcoal text-paper"
      aria-label="Introduction"
    >
      <div data-hero-parallax className="absolute inset-0">
        <div data-hero-media className="absolute inset-0">
          {slides.slice(0, mounted).map((slide, i) => (
            <div
              key={slide.photo.id}
              className="absolute inset-0"
              style={{
                opacity: i === active ? 1 : 0,
                zIndex: i === active ? 1 : 0,
                transition: "opacity 1.8s cubic-bezier(0.215, 0.61, 0.355, 1)",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  transform: i === active ? "scale(1)" : "scale(1.08)",
                  transition: `transform ${SLIDE_MS + 1800}ms linear`,
                }}
              >
                <Image
                  src={slide.photo.src}
                  alt={i === active ? slide.photo.alt : ""}
                  fill
                  sizes="100vw"
                  preload={i === 0}
                  placeholder={slide.photo.blurDataURL ?? "empty"}
                  className="object-cover"
                  data-critical={i === 0 || undefined}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/45 via-black/5 to-black/60" />
      </div>

      <div data-hero-content className="relative z-10 flex h-full flex-col justify-end container-x pb-6 md:pb-10">
        <p data-hero-fade className="label mb-6 max-w-xs md:mb-8">
          Wedding & event photography
          <br />
          {studio.base} — {studio.reach}
        </p>

        <h1 className="font-serif text-mega">
          <span className="sr-only">{studio.name} — wedding and event photographer in Bengaluru</span>
          <span data-hero-title aria-hidden="true" className="block">
            <span className="block">Chirag</span> <span className="block pl-[14vw] italic">Photography</span>
          </span>
        </h1>

        <div className="mt-6 grid grid-cols-2 items-end gap-6 md:mt-10 md:grid-cols-12">
          <p data-hero-fade className="col-span-2 max-w-[17ch] font-serif text-h3 italic md:col-span-5">
            {studio.tagline}
          </p>

          <div data-hero-fade className="col-span-1 md:col-span-4 md:col-start-7" aria-hidden="true">
            <p className="label mb-3 tabular-nums">
              {pad(active + 1)} / {pad(slides.length)} — {current.label}, {current.place}
            </p>
            <div className="flex gap-2">
              {slides.map((slide, i) => (
                <span key={slide.photo.id} className="relative h-px flex-1 overflow-hidden bg-paper/30">
                  {i === active && (
                    <span
                      key={active}
                      className="absolute inset-0 origin-left bg-paper"
                      style={{ animation: `hero-progress ${SLIDE_MS}ms linear forwards` }}
                    />
                  )}
                  {i < active && <span className="absolute inset-0 bg-paper" />}
                </span>
              ))}
            </div>
          </div>

          <a
            data-hero-fade
            href="#intro"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("#intro");
            }}
            className="label col-span-1 flex items-center justify-end gap-3 justify-self-end md:col-span-2 md:col-start-11"
          >
            Scroll
            <span className="relative block h-10 w-px overflow-hidden bg-paper/30">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_2.2s_cubic-bezier(0.65,0,0.35,1)_infinite] bg-paper" />
            </span>
          </a>
        </div>
        <nav
          data-hero-fade
          aria-label="Explore by event"
          className="no-scrollbar -mx-[var(--gutter)] mt-6 flex items-baseline gap-6 overflow-x-auto border-t border-paper/25 px-[var(--gutter)] pt-4 md:mx-0 md:mt-8 md:gap-9 md:px-0"
        >
          <span className="label shrink-0 text-paper/75">Explore by event —</span>
          {categories.map((c) => (
            <TransitionLink
              key={c.slug}
              href={`/?category=${c.slug}#work`}
              className="u-link shrink-0 font-serif text-lg whitespace-nowrap italic md:text-2xl"
            >
              {c.filterLabel}
            </TransitionLink>
          ))}
        </nav>
      </div>
    </section>
  );
}
