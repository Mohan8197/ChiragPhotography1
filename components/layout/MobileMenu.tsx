"use client";

import { useEffect, useRef } from "react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { navLinks, socials, studio } from "@/data/site";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { startScroll, stopScroll } from "@/lib/scroll";
import { pad, prefersReducedMotion } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  useGSAP(
    () => {
      const el = ref.current!;
      const page = document.getElementById("page");
      const instant = prefersReducedMotion();
      if (open) {
        wasOpen.current = true;
        stopScroll();
        if (page) page.inert = true;
        gsap
          .timeline()
          .set(el, { autoAlpha: 1 })
          .fromTo(
            el,
            { clipPath: "inset(0% 0% 100% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: instant ? 0 : 0.9, ease: "expo.inOut" },
          )
          .fromTo(
            "[data-menu-item]",
            { yPercent: 110 },
            { yPercent: 0, duration: instant ? 0 : 1, ease: "expo.out", stagger: 0.06 },
            instant ? 0 : 0.35,
          )
          .add(() => el.querySelector<HTMLElement>("a")?.focus());
      } else if (wasOpen.current) {
        wasOpen.current = false;
        startScroll();
        if (page) page.inert = false;
        gsap
          .timeline()
          .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: instant ? 0 : 0.8, ease: "expo.inOut" })
          .set(el, { autoAlpha: 0 });
      }
    },
    { dependencies: [open], scope: ref },
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      ref={ref}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      className="invisible fixed inset-0 z-40 flex flex-col justify-between bg-charcoal pt-28 pb-8 text-paper container-x md:hidden"
    >
      <nav aria-label="Mobile">
        <ul className="space-y-2">
          {navLinks.map((link, i) => (
            <li key={link.href} className="overflow-hidden">
              <div data-menu-item className="flex items-baseline gap-4">
                <span className="label text-stone tabular-nums">{pad(i + 1)}</span>
                <TransitionLink
                  href={link.href}
                  onClick={onClose}
                  tabIndex={open ? 0 : -1}
                  className="font-serif text-[clamp(3rem,15vw,5rem)] leading-[1.05]"
                >
                  {link.label}
                </TransitionLink>
              </div>
            </li>
          ))}
        </ul>
      </nav>
      <div className="space-y-4 text-sm">
        <a href={`mailto:${studio.email}`} tabIndex={open ? 0 : -1} className="block font-serif text-2xl italic">
          {studio.email}
        </a>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1} className="label text-stone">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
