import type { Filter } from "@/data/categories";
import type { Photo } from "@/data/types";

/**
 * Every filter has its own layout. A layout is a set of classes for the list
 * plus a function that styles the item at visible position `i`. GSAP Flip then
 * animates each image from its old box to its new one.
 */
export interface SlotStyle {
  /** Classes for the <li> (grid placement, spans, offsets) */
  className: string;
  /** Classes for the <figure> (e.g. offsets that must not clash with Flip's transforms on the li) */
  figureClassName?: string;
  /** Frame aspect ratio (w / h). Omit to let the layout's CSS size the frame. */
  ratio?: number;
  /** `sizes` attribute for this slot */
  sizes: string;
  variant?: "polaroid";
  /** Polaroid tilt in degrees */
  tilt?: number;
}

export interface LayoutDef {
  list: string;
  slot: (i: number, photo: Photo) => SlotStyle;
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const natural = (p: Photo) => clamp(p.width / p.height, 0.66, 1.78);

/* All — editorial masonry: varied widths, staggered drops, two per row. */
const ALL_SLOTS: Array<[string, string]> = [
  ["md:col-span-6 md:col-start-1", "50vw"],
  ["md:col-span-4 md:col-start-8 md:mt-[18vh]", "34vw"],
  ["md:col-span-3 md:col-start-2", "25vw"],
  ["md:col-span-5 md:col-start-6 md:mt-[10vh]", "42vw"],
  ["md:col-span-4 md:col-start-1 md:mt-[6vh]", "34vw"],
  ["md:col-span-6 md:col-start-6", "50vw"],
  ["md:col-span-5 md:col-start-2 md:mt-[4vh]", "42vw"],
  ["md:col-span-3 md:col-start-9 md:mt-[20vh]", "25vw"],
];

/* Weddings — after the full-bleed opener, an asymmetric two-column rhythm. */
const WEDDING_SLOTS: Array<[string, string]> = [
  ["col-span-12 md:col-span-6 md:col-start-2", "(min-width: 768px) 50vw, 100vw"],
  ["col-span-9 col-start-4 md:col-span-4 md:col-start-9 md:mt-[22vh]", "(min-width: 768px) 34vw, 75vw"],
  ["col-span-9 md:col-span-4 md:col-start-2 md:mt-[6vh]", "(min-width: 768px) 34vw, 75vw"],
  ["col-span-12 md:col-span-6 md:col-start-7", "(min-width: 768px) 50vw, 100vw"],
];

/* Engagements — a single centred column, drifting gently left and right. */
const ENGAGEMENT_SLOTS = [
  "col-span-10 col-start-1 md:col-span-6 md:col-start-3 lg:col-span-4 lg:col-start-4",
  "col-span-10 col-start-3 md:col-span-6 md:col-start-6 lg:col-span-4 lg:col-start-6",
  "col-span-10 col-start-2 md:col-span-6 md:col-start-4 lg:col-span-4 lg:col-start-5",
];

/* Birthdays — a six-cell bento that tiles perfectly at 2, 4 and 6 columns. */
const BENTO_BIG = "(min-width: 1024px) 34vw, (min-width: 768px) 50vw, 100vw";
const BENTO_SMALL = "(min-width: 1024px) 17vw, (min-width: 768px) 25vw, 50vw";
const BIRTHDAY_SLOTS: SlotStyle[] = [
  { className: "col-span-2 row-span-2", sizes: BENTO_BIG },
  { className: "col-span-1 row-span-1", sizes: BENTO_SMALL, variant: "polaroid", tilt: -3 },
  { className: "col-span-1 row-span-2", sizes: BENTO_SMALL },
  { className: "col-span-2 row-span-1", sizes: BENTO_BIG },
  { className: "col-span-1 row-span-1", sizes: BENTO_SMALL, variant: "polaroid", tilt: 2.5 },
  { className: "col-span-2 row-span-1", sizes: BENTO_BIG },
];

export const layouts: Record<Filter, LayoutDef> = {
  all: {
    list: "grid grid-cols-2 items-start gap-x-4 gap-y-12 md:grid-cols-12 md:gap-x-[var(--col-gap)] md:gap-y-28",
    slot: (i, photo) => {
      const [desktop, size] = ALL_SLOTS[i % ALL_SLOTS.length];
      const full = i % 3 === 0;
      return {
        className: `${full ? "col-span-2" : "col-span-1"} ${desktop}`,
        ratio: natural(photo),
        sizes: `(min-width: 768px) ${size}, ${full ? "100vw" : "50vw"}`,
      };
    },
  },

  weddings: {
    list: "grid grid-cols-12 items-start gap-x-[var(--col-gap)] gap-y-16 md:gap-y-32",
    slot: (i, photo) => {
      if (i === 0) {
        return {
          className: "col-span-12 -mx-[var(--gutter)] [--ar:1.2] md:[--ar:2.2]",
          sizes: "100vw",
        };
      }
      const [className, sizes] = WEDDING_SLOTS[(i - 1) % WEDDING_SLOTS.length];
      return { className, sizes, ratio: natural(photo) };
    },
  },

  engagements: {
    list: "grid grid-cols-12 gap-y-20 md:gap-y-36",
    slot: (i) => ({
      className: ENGAGEMENT_SLOTS[i % ENGAGEMENT_SLOTS.length],
      ratio: 4 / 5,
      sizes: "(min-width: 1024px) 34vw, (min-width: 768px) 50vw, 84vw",
    }),
  },

  birthdays: {
    list: "grid grid-flow-row-dense grid-cols-2 auto-rows-[44vw] gap-3 md:grid-cols-4 md:auto-rows-[22vw] md:gap-4 lg:grid-cols-6 lg:auto-rows-[15vw]",
    slot: (i) => BIRTHDAY_SLOTS[i % BIRTHDAY_SLOTS.length],
  },

  parties: {
    list: "-mx-[var(--gutter)] flex snap-x snap-mandatory items-start gap-4 overflow-x-auto px-[var(--gutter)] py-14 no-scrollbar md:snap-none md:gap-6",
    slot: (_i, photo) => {
      const ratio = natural(photo);
      return {
        className: "shrink-0 snap-start",
        ratio,
        sizes: `(min-width: 768px) ${Math.round(ratio * 38)}vw, ${Math.min(80, Math.round(ratio * 118))}vw`,
      };
    },
  },

  "baby-showers": {
    list: "grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-10 md:gap-y-20 md:pb-[12vh] lg:gap-x-16",
    slot: (i) => ({
      className: "",
      figureClassName: i % 3 === 1 ? "md:translate-y-[12vh]" : undefined,
      ratio: 4 / 5,
      sizes: "(min-width: 768px) 30vw, 50vw",
    }),
  },

  corporate: {
    list: "grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-4 md:gap-y-12 lg:grid-cols-4",
    slot: () => ({
      className: "",
      ratio: 3 / 2,
      sizes: "(min-width: 1024px) 25vw, (min-width: 768px) 34vw, 50vw",
    }),
  },
};
