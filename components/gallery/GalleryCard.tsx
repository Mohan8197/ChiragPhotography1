"use client";

import Image from "next/image";
import { memo, useRef, type CSSProperties } from "react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import type { Filter } from "@/data/categories";
import type { GalleryItem } from "@/data/types";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { cn, pad, prefersReducedMotion } from "@/lib/utils";
import type { SlotStyle } from "./layouts";

interface Props {
  item: GalleryItem;
  layout: Filter;
  /** Position within the active filter, or -1 when hidden */
  index: number;
  slot: SlotStyle | null;
  onOpen: (key: string) => void;
}

function GalleryCardBase({ item, layout, index, slot, onOpen }: Props) {
  const frameRef = useRef<HTMLButtonElement>(null);
  const hidden = index < 0 || !slot;
  const { photo, project } = item;

  // Parallax drift inside the frame
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        frameRef.current!.firstElementChild,
        { yPercent: -5 },
        {
          yPercent: 5,
          ease: "none",
          scrollTrigger: { trigger: frameRef.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    },
    { scope: frameRef },
  );

  const style = {
    ...(slot?.ratio ? { "--ar": slot.ratio } : null),
    ...(slot?.tilt ? { "--tilt": `${slot.tilt}deg` } : null),
  } as CSSProperties;

  const meta = layout === "corporate" ? `${project.client} · ${project.location}` : `${project.location}, ${project.year}`;
  const indexLabel = layout === "parties" ? `EV 400 — ${pad(index + 1)}A` : pad(index + 1);

  return (
    <li
      data-flip-id={item.key}
      data-hidden={hidden || undefined}
      data-variant={slot?.variant}
      aria-hidden={hidden || undefined}
      inert={hidden}
      className={cn("g-item relative", slot?.className)}
      style={style}
    >
      <figure className={cn("g-figure", slot?.figureClassName)}>
        <button
          ref={frameRef}
          type="button"
          className="g-frame"
          data-cursor="View"
          onClick={() => onOpen(item.key)}
        >
          <span className="g-parallax">
            <span className="g-media">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes={slot?.sizes ?? "50vw"}
                quality={60}
                placeholder={photo.blurDataURL ?? "empty"}
                className="object-cover"
              />
            </span>
          </span>
          <span className="sr-only">— open full screen</span>
        </button>
        <figcaption className="g-caption">
          <span className="g-index" aria-hidden="true">
            {indexLabel}
          </span>
          <TransitionLink href={`/work/${project.slug}`} className="g-title u-link">
            {project.title}
          </TransitionLink>
          <span className="g-meta">{meta}</span>
          <span className="g-moment">{photo.caption}</span>
        </figcaption>
      </figure>
    </li>
  );
}

export const GalleryCard = memo(GalleryCardBase);
