"use client";

import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP);
  gsap.defaults({ ease: "power3.out", duration: 1.1 });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** House easings — slow, deliberate, never bouncy. */
export const EASE = {
  out: "power3.out",
  expo: "expo.out",
  inOut: "expo.inOut",
  soft: "power2.out",
} as const;

export { gsap, Flip, ScrollTrigger, SplitText, useGSAP };
