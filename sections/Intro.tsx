"use client";

import { useRef } from "react";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Rich } from "@/components/ui/Rich";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { intro } from "@/data/site";
import { gsap, SplitText, useGSAP } from "@/lib/animations/gsap";
import { prefersReducedMotion } from "@/lib/utils";

/** The studio statement — each word darkens from stone to ink as it scrolls through. */
export function Intro() {
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      SplitText.create(textRef.current, {
        type: "words",
        autoSplit: true,
        onSplit(self) {
          return gsap.fromTo(
            self.words,
            { color: "#8a857d" },
            {
              color: "#1a1a18",
              ease: "none",
              stagger: 0.1,
              scrollTrigger: { trigger: textRef.current, start: "top 78%", end: "bottom 45%", scrub: 0.6 },
            },
          );
        },
      });
    },
    { scope: textRef },
  );

  return (
    <section id="intro" data-theme="light" className="container-x py-[18vh] md:py-[26vh]">
      <div className="grid-12 gap-y-10">
        <SplitReveal as="p" className="label col-span-12 text-stone-deep md:col-span-3">
          (01) — The studio
        </SplitReveal>
        <p ref={textRef} className="col-span-12 font-serif text-lead md:col-span-9">
          <Rich text={intro} />
        </p>
        <div className="col-span-12 grid gap-8 sm:grid-cols-2 md:col-span-6 md:col-start-4 md:mt-8">
          <p className="text-stone-deep">
            Based in Bengaluru, Chirag Photography covers weddings, pre-wedding sessions, birthdays, engagements,
            family celebrations and corporate events. We bring a thoughtful, candid approach to every occasion.
          </p>
          <div className="flex items-end">
            <TransitionLink href="/#about" className="label u-link">
              Meet the studio →
            </TransitionLink>
          </div>
        </div>
      </div>
    </section>
  );
}
