"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { categories, type CategorySlug } from "@/data/categories";
import type { Photo } from "@/data/types";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { hasFinePointer, pad, prefersReducedMotion } from "@/lib/utils";

/** Large-type service list; a preview of each event type follows the cursor. */
export function Services({ covers }: { covers: Record<CategorySlug, Photo> }) {
  const rootRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<CategorySlug | null>(null);
  const api = useRef<{ show: () => void; hide: () => void }>({ show: () => {}, hide: () => {} });

  useGSAP(
    () => {
      if (!hasFinePointer() || prefersReducedMotion()) return;
      const root = rootRef.current!;
      const preview = previewRef.current!;
      gsap.set(preview, { autoAlpha: 0, scale: 0.7 });
      const xTo = gsap.quickTo(preview, "x", { duration: 0.7, ease: "power3.out" });
      const yTo = gsap.quickTo(preview, "y", { duration: 0.7, ease: "power3.out" });
      const last = { x: 0, y: 0 };
      const follow = () => {
        const r = root.getBoundingClientRect();
        xTo(last.x - r.left - preview.offsetWidth / 2);
        yTo(last.y - r.top - preview.offsetHeight / 2);
      };
      const move = (e: PointerEvent) => {
        last.x = e.clientX;
        last.y = e.clientY;
        follow();
      };
      root.addEventListener("pointermove", move);
      window.addEventListener("scroll", follow, { passive: true });
      api.current = {
        show: () => gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "expo.out" }),
        hide: () => gsap.to(preview, { autoAlpha: 0, scale: 0.7, duration: 0.5, ease: "power3.out" }),
      };
      return () => {
        root.removeEventListener("pointermove", move);
        window.removeEventListener("scroll", follow);
      };
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} id="services" data-theme="light" className="relative container-x py-[16vh]">
      <div className="grid-12 mb-14 items-end gap-y-6 md:mb-20">
        <p className="label col-span-12 text-stone-deep md:col-span-3">(04) — Services</p>
        <SplitReveal as="h2" className="col-span-12 font-serif text-h1 md:col-span-9">
          Six ways to <em className="italic">celebrate</em>
        </SplitReveal>
      </div>

      <ul onPointerLeave={() => api.current.hide()}>
        {categories.map((c, i) => (
          <li key={c.slug} className="border-t border-ink/15 last:border-b">
            <TransitionLink
              href={`/work?category=${c.slug}`}
              onPointerEnter={() => {
                setActive(c.slug);
                api.current.show();
              }}
              className="group relative grid grid-cols-12 items-center gap-x-[var(--col-gap)] py-6 md:py-8"
            >
              <span className="label col-span-2 text-stone-deep tabular-nums md:col-span-1">{pad(i + 1)}</span>
              <span className="col-span-8 font-serif text-h2 transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-4 md:col-span-6 md:group-hover:translate-x-8">
                {c.label}
              </span>
              <span className="relative col-span-2 aspect-square overflow-hidden rounded-sm pointer-fine:hidden md:hidden">
                <Image src={covers[c.slug].src} alt="" fill sizes="64px" className="object-cover" />
              </span>
              <span className="hidden text-sm text-stone-deep md:col-span-3 md:block">{c.description}</span>
              <span className="label hidden text-right md:col-span-2 md:block">
                {c.mood} <span aria-hidden="true">→</span>
              </span>
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-champagne transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-x-100"
              />
            </TransitionLink>
          </li>
        ))}
      </ul>

      <div
        ref={previewRef}
        aria-hidden="true"
        className="pointer-events-none invisible absolute top-0 left-0 z-10 hidden aspect-[4/5] w-[clamp(220px,20vw,340px)] overflow-hidden pointer-fine:block"
      >
        {categories.map((c) => (
          <Image
            key={c.slug}
            src={covers[c.slug].src}
            alt=""
            fill
            sizes="340px"
            className="object-cover transition-[opacity,transform] duration-700"
            style={{ opacity: active === c.slug ? 1 : 0, transform: active === c.slug ? "scale(1)" : "scale(1.12)" }}
          />
        ))}
      </div>
    </section>
  );
}
