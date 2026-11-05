"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import type { Photo } from "@/data/types";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/animations/gsap";
import { pageReveal } from "@/lib/animations/page-reveal";
import { cn, prefersReducedMotion } from "@/lib/utils";

interface Props {
  photo: Photo;
  sizes: string;
  className?: string;
  /** Frame aspect ratio — defaults to the photo's own; "fill" sizes from the parent */
  ratio?: number | "fill";
  parallax?: boolean;
  /** "scroll": reveal on entering view · "page": reveal when the page is shown · false: no reveal */
  reveal?: "scroll" | "page" | false;
  preload?: boolean;
  /** Marks the LCP image so the preloader can wait for it */
  critical?: boolean;
  objectPosition?: string;
}

/**
 * An image that wipes in with a clip-path inset while easing down from 1.15× scale,
 * with optional parallax drift inside its frame.
 */
export function RevealImage({
  photo,
  sizes,
  className,
  ratio,
  parallax = true,
  reveal = "scroll",
  preload = false,
  critical = false,
  objectPosition,
}: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const driftRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const frame = frameRef.current!;

      if (parallax) {
        gsap.fromTo(
          driftRef.current,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      }

      if (!reveal) return;
      const tl = gsap
        .timeline({ paused: true })
        .fromTo(
          frame,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" },
        )
        .fromTo(zoomRef.current, { scale: 1.15 }, { scale: 1, duration: 2, ease: "expo.out" }, 0);

      if (reveal === "page") return pageReveal.when(() => tl.play());
      ScrollTrigger.create({ trigger: frame, start: "top 88%", once: true, onEnter: () => tl.play() });
    },
    { scope: frameRef },
  );

  const aspect = ratio === "fill" ? undefined : (ratio ?? photo.width / photo.height);
  const style: CSSProperties | undefined = aspect ? { aspectRatio: aspect } : undefined;

  return (
    <div ref={frameRef} className={cn("relative overflow-hidden bg-ink/5", className)} style={style}>
      <div ref={driftRef} className={cn("absolute inset-x-0", parallax ? "-inset-y-[7%]" : "inset-y-0")}>
        <div ref={zoomRef} className="absolute inset-0">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes={sizes}
            preload={preload}
            placeholder={photo.blurDataURL ?? "empty"}
            className="object-cover"
            style={objectPosition ? { objectPosition } : undefined}
            data-critical={critical || undefined}
          />
        </div>
      </div>
    </div>
  );
}
