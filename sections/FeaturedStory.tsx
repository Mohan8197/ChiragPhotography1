"use client";

import Image from "next/image";
import { useRef } from "react";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { useLightbox } from "@/components/providers/LightboxProvider";
import { TransitionLink } from "@/components/ui/TransitionLink";
import type { LightboxItem, Project } from "@/data/types";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { cn, pad } from "@/lib/utils";

/** Varied frame heights + vertical placement so the strip reads like a contact sheet laid out by hand. */
const RHYTHM = [
  { h: "md:h-[70vh]", place: "md:self-center" },
  { h: "md:h-[52vh]", place: "md:self-end md:mb-[9vh]" },
  { h: "md:h-[60vh]", place: "md:self-start md:mt-[13vh]" },
  { h: "md:h-[74vh]", place: "md:self-center" },
  { h: "md:h-[48vh]", place: "md:self-start md:mt-[17vh]" },
  { h: "md:h-[62vh]", place: "md:self-end md:mb-[7vh]" },
];

interface Props {
  project: Project;
  lightboxItems: LightboxItem[];
}

export function FeaturedStory({ project, lightboxItems }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const openLightbox = useLightbox();
  const total = project.photos.length;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const track = trackRef.current!;
        const distance = () => track.scrollWidth - window.innerWidth;

        const scroll = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(progressRef.current, { scaleX: self.progress }),
          },
        });

        // Parallax inside each frame as it crosses the viewport horizontally
        gsap.utils.toArray<HTMLElement>("[data-story-frame]").forEach((frame) => {
          gsap.fromTo(
            frame.querySelector("[data-drift]"),
            { xPercent: -7 },
            {
              xPercent: 7,
              ease: "none",
              scrollTrigger: {
                trigger: frame,
                containerAnimation: scroll,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      data-theme="dark"
      aria-labelledby="featured-title"
      className="relative overflow-hidden bg-charcoal text-paper"
    >
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory items-stretch gap-6 overflow-x-auto py-24 pl-[var(--gutter)] pr-[var(--gutter)] md:h-[100svh] md:snap-none md:items-center md:gap-[4vw] md:overflow-visible md:py-0 md:pr-[10vw] motion-reduce:md:overflow-x-auto"
      >
        {/* Opening panel */}
        <div className="flex w-[84vw] shrink-0 snap-start flex-col justify-between gap-10 md:h-[76vh] md:w-[40vw] lg:w-[34vw]">
          <p className="label text-stone">(03) — Featured story</p>
          <div>
            <SplitReveal as="h2" id="featured-title" className="font-serif text-display">
              {project.title.split(" & ")[0]} <em className="italic">&amp; {project.title.split(" & ")[1]}</em>
            </SplitReveal>
            <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-paper/15 pt-5">
              {[
                ["Venue", project.venue],
                ["Location", project.location],
                ["Year", String(project.year)],
              ].map(([term, value]) => (
                <div key={term}>
                  <dt className="label text-stone">{term}</dt>
                  <dd className="mt-2 text-sm text-paper/85">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="space-y-6">
            <p className="max-w-[38ch] text-paper/75">{project.excerpt}</p>
            <TransitionLink href={`/work/${project.slug}`} className="label u-link">
              Read the full story →
            </TransitionLink>
          </div>
        </div>

        {project.photos.map((photo, i) => {
          const rhythm = RHYTHM[i % RHYTHM.length];
          const ratio = photo.width / photo.height;
          return (
            <figure key={photo.id} data-story-frame className={cn("shrink-0 snap-center", rhythm.place)}>
              <button
                type="button"
                data-cursor="View"
                onClick={() => openLightbox(lightboxItems, i)}
                className={cn("relative block h-[56vh] max-w-[84vw] overflow-hidden bg-paper/5", rhythm.h)}
                style={{ aspectRatio: ratio }}
              >
                <span data-drift className="absolute inset-y-0 -inset-x-[9%]">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes={`(min-width: 768px) ${Math.round(ratio * 52)}vw, 84vw`}
                    placeholder={photo.blurDataURL ?? "empty"}
                    className="object-cover"
                  />
                </span>
                <span className="sr-only">— open full screen</span>
              </button>
              <figcaption className="mt-4 flex w-0 min-w-full justify-between gap-4 text-paper/70">
                <span className="label tabular-nums">
                  {pad(i + 1)} / {pad(total)}
                </span>
                <span className="font-serif text-lg italic">{photo.caption}</span>
              </figcaption>
            </figure>
          );
        })}

        {/* Closing panel */}
        <div className="flex w-[70vw] shrink-0 snap-start flex-col justify-center md:w-[28vw]">
          <p className="font-serif text-h2 italic">Fin.</p>
          <p className="mt-4 max-w-[30ch] text-paper/75">
            {project.guests} guests, three days, one meadow at golden hour.
          </p>
          <TransitionLink href={`/work/${project.slug}`} className="label u-link mt-8 w-fit">
            See every frame →
          </TransitionLink>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-[var(--gutter)] bottom-8 hidden h-px bg-paper/15 md:block motion-reduce:hidden">
        <span ref={progressRef} className="block h-full origin-left scale-x-0 bg-champagne" />
      </div>
    </section>
  );
}
