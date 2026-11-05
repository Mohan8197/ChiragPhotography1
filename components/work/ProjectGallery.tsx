"use client";

import { RevealImage } from "@/components/motion/RevealImage";
import { useLightbox } from "@/components/providers/LightboxProvider";
import type { LightboxItem } from "@/data/types";
import { cn } from "@/lib/utils";

/**
 * Image rhythm for a story: full-bleed → two columns → single offset, repeating.
 * Photo 0 is the hero, so this starts at photo 1.
 */
export function ProjectGallery({ items }: { items: LightboxItem[] }) {
  const open = useLightbox();
  const rest = items.slice(1);

  const blocks: Array<{ kind: "full" | "pair" | "single"; idx: number[] }> = [];
  for (let i = 0; i < rest.length; ) {
    const step = blocks.length % 3;
    if (step === 0) blocks.push({ kind: "full", idx: [i++] });
    else if (step === 1 && i + 1 < rest.length) blocks.push({ kind: "pair", idx: [i++, i++] });
    else blocks.push({ kind: "single", idx: [i++] });
  }

  const frame = (i: number, sizes: string, className?: string, ratio?: number) => (
    <figure key={rest[i].photo.id} className={className}>
      <button
        type="button"
        data-cursor="View"
        onClick={() => open(items, i + 1)}
        className="block w-full"
        aria-label={`${rest[i].photo.alt} — open full screen`}
      >
        <RevealImage photo={rest[i].photo} sizes={sizes} ratio={ratio} />
      </button>
      <figcaption className="mt-3 font-serif text-lg italic text-stone-deep">{rest[i].photo.caption}</figcaption>
    </figure>
  );

  return (
    <div className="space-y-[14vh]">
      {blocks.map((b, n) => {
        if (b.kind === "full") {
          return (
            <div key={n} className="-mx-[var(--gutter)] [&_figcaption]:px-[var(--gutter)]">
              {frame(b.idx[0], "100vw", undefined, 16 / 9)}
            </div>
          );
        }
        if (b.kind === "pair") {
          return (
            <div key={n} className="grid-12 items-start gap-y-14">
              {frame(b.idx[0], "(min-width: 768px) 45vw, 100vw", "col-span-12 md:col-span-5")}
              {frame(b.idx[1], "(min-width: 768px) 45vw, 100vw", "col-span-12 md:col-span-6 md:col-start-7 md:mt-[16vh]")}
            </div>
          );
        }
        return (
          <div key={n} className="grid-12">
            {frame(b.idx[0], "(min-width: 768px) 50vw, 100vw", cn("col-span-12 md:col-span-6", n % 2 ? "md:col-start-2" : "md:col-start-6"))}
          </div>
        );
      })}
    </div>
  );
}
