"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/animations/gsap";
import { scroller } from "@/lib/scroll";
import { prefersReducedMotion } from "@/lib/utils";

/** Lenis smooth scrolling, driven by the GSAP ticker so ScrollTrigger stays in lockstep. */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ lerp: 0.085, autoRaf: false });
    scroller.lenis = lenis;
    if (document.documentElement.classList.contains("is-loading")) lenis.stop();

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      scroller.lenis = null;
    };
  }, []);

  return null;
}
