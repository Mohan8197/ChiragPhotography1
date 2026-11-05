"use client";

import Image from "next/image";
import { useRef } from "react";
import { SplitReveal } from "@/components/motion/SplitReveal";
import type { Photo } from "@/data/types";
import { studio } from "@/data/site";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/animations/gsap";
import { prefersReducedMotion } from "@/lib/utils";

/** Infinite marquee that speeds up with scroll velocity and slows on hover. */
export function Journal({ photos }: { photos: Photo[] }) {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const track = trackRef.current!;
      const loop = gsap.to(track, { xPercent: -50, ease: "none", duration: 70, repeat: -1 });
      let boost = 0;
      let hover = false;
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => loop.paused(!self.isActive),
        onUpdate: (self) => (boost = Math.min(Math.abs(self.getVelocity()) / 250, 8)),
      });
      const tick = () => {
        boost *= 0.93;
        const target = hover ? 0.1 : 1 + boost;
        loop.timeScale(loop.timeScale() + (target - loop.timeScale()) * 0.08);
      };
      gsap.ticker.add(tick);
      const enter = () => (hover = true);
      const leave = () => (hover = false);
      track.addEventListener("pointerenter", enter);
      track.addEventListener("pointerleave", leave);
      return () => {
        gsap.ticker.remove(tick);
        track.removeEventListener("pointerenter", enter);
        track.removeEventListener("pointerleave", leave);
      };
    },
    { scope: rootRef },
  );

  const tiles = (copy: number) =>
    photos.map((p) => (
      <div
        key={`${copy}-${p.id}`}
        className="relative h-[clamp(200px,32vh,340px)] shrink-0 overflow-hidden rounded-[2px]"
        style={{ aspectRatio: p.width / p.height }}
      >
        <Image
          src={p.src}
          alt={copy === 0 ? p.alt : ""}
          fill
          sizes="(min-width: 768px) 24vw, 60vw"
          quality={60}
          placeholder={p.blurDataURL ?? "empty"}
          className="object-cover"
        />
      </div>
    ));

  return (
    <section ref={rootRef} id="journal" data-theme="light" className="overflow-hidden py-[14vh]">
      <div className="container-x grid-12 mb-12 items-end gap-y-6 md:mb-16">
        <p className="label col-span-12 text-stone-deep md:col-span-3">(07) — Journal</p>
        <SplitReveal as="h2" className="col-span-12 font-serif text-h2 md:col-span-6">
          Notes from <em className="italic">the road</em>
        </SplitReveal>
        <a
          href={studio.instagram.url}
          target="_blank"
          rel="noreferrer"
          className="label u-link col-span-12 w-fit md:col-span-3 md:justify-self-end"
        >
          {studio.instagram.handle} ↗
        </a>
      </div>
      <div className="no-scrollbar motion-reduce:overflow-x-auto">
        <div ref={trackRef} className="flex w-max gap-4 pr-4">
          {tiles(0)}
          <div className="contents" aria-hidden="true">
            {tiles(1)}
          </div>
        </div>
      </div>
    </section>
  );
}
