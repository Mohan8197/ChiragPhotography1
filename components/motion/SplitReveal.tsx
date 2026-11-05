"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/animations/gsap";
import { pageReveal } from "@/lib/animations/page-reveal";
import { prefersReducedMotion } from "@/lib/utils";

interface Props {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  id?: string;
  /** Unit that slides up through the line masks */
  by?: "lines" | "words" | "chars";
  /** "scroll": when it enters the viewport · "page": when the page is revealed */
  on?: "scroll" | "page";
  delay?: number;
  stagger?: number;
  start?: string;
}

/** Text that rises line by line (or word/char) through masks, with stagger. */
export function SplitReveal({
  as: Tag = "div",
  children,
  className,
  id,
  by = "lines",
  on = "scroll",
  delay = 0,
  stagger,
  start = "top 88%",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      let revealed = on === "scroll";
      let tween: gsap.core.Tween | undefined;

      SplitText.create(el, {
        type: by === "lines" ? "lines" : `lines, ${by}`,
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit(self) {
          const targets = by === "lines" ? self.lines : by === "words" ? self.words : self.chars;
          tween = gsap.fromTo(
            targets,
            { yPercent: 115 },
            {
              yPercent: 0,
              duration: by === "chars" ? 1.3 : 1.25,
              ease: "expo.out",
              stagger: stagger ?? (by === "chars" ? 0.028 : by === "words" ? 0.04 : 0.1),
              delay,
              paused: !revealed,
              scrollTrigger: on === "scroll" ? { trigger: el, start, once: true } : undefined,
            },
          );
          return tween;
        },
      });

      if (on === "page") {
        return pageReveal.when(() => {
          revealed = true;
          tween?.play();
        });
      }
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}
