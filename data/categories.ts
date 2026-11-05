/**
 * Client-safe category data (no photo payloads) — import freely from client components.
 * Each category owns a mood, service copy and the gallery colour theme it switches to.
 */

export const CATEGORY_SLUGS = [
  "weddings",
  "engagements",
  "birthdays",
  "parties",
  "baby-showers",
  "corporate",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];
export type Filter = "all" | CategorySlug;
export const FILTERS: Filter[] = ["all", ...CATEGORY_SLUGS];

export interface CategoryTheme {
  /** Gallery background while this filter is active */
  bg: string;
  /** Primary text on that background */
  ink: string;
  /** Secondary text — ≥ 4.5:1 on `bg` */
  muted: string;
  /** Decorative accent: hairlines, indicator, dots */
  accent: string;
  /** Accent dark (or light) enough for small text on `bg` */
  accentInk: string;
}

export interface Category {
  slug: CategorySlug;
  label: string;
  filterLabel: string;
  mood: string;
  description: string;
  theme: CategoryTheme;
}

export const ALL_THEME: CategoryTheme = {
  bg: "#F4F1EC",
  ink: "#1A1A18",
  muted: "#6B665E",
  accent: "#B89B72",
  accentInk: "#7D6646",
};

export const categories: Category[] = [
  {
    slug: "weddings",
    label: "Weddings",
    filterLabel: "Weddings",
    mood: "Timeless & elegant",
    description: "Documentary coverage from first look to last dance, with heirloom albums and fine-art prints.",
    theme: { bg: "#F4F1EC", ink: "#1A1A18", muted: "#6B665E", accent: "#B89B72", accentInk: "#7D6646" },
  },
  {
    slug: "engagements",
    label: "Engagements",
    filterLabel: "Engagements",
    mood: "Soft & intimate",
    description: "Engagement sessions and surprise proposals, wherever the light is kindest.",
    theme: { bg: "#F3ECE9", ink: "#2A2220", muted: "#6E605B", accent: "#C9A39A", accentInk: "#8A5F55" },
  },
  {
    slug: "birthdays",
    label: "Birthdays",
    filterLabel: "Birthdays",
    mood: "Joyful & warm",
    description: "Milestone birthdays for every age — from first candles to ninetieth toasts.",
    theme: { bg: "#F8EFEA", ink: "#211A17", muted: "#6F5F58", accent: "#E8A598", accentInk: "#A4503B" },
  },
  {
    slug: "parties",
    label: "Parties & Nightlife",
    filterLabel: "Parties",
    mood: "Bold & energetic",
    description: "Private parties, club nights and New Year's Eve — shot in the language of the dance floor.",
    theme: { bg: "#141413", ink: "#F4F1EC", muted: "#A39D93", accent: "#C8A04A", accentInk: "#D4AE5C" },
  },
  {
    slug: "baby-showers",
    label: "Baby Showers",
    filterLabel: "Baby Showers",
    mood: "Light & tender",
    description: "Showers, maternity sessions and the quiet, golden weeks of waiting.",
    theme: { bg: "#EFF2EC", ink: "#1D201C", muted: "#5F665C", accent: "#C9D6C3", accentInk: "#566C50" },
  },
  {
    slug: "corporate",
    label: "Corporate",
    filterLabel: "Corporate",
    mood: "Clean & precise",
    description: "Summits, galas and launches, with same-day selects for press and partners.",
    theme: { bg: "#ECEDEE", ink: "#16181B", muted: "#555C64", accent: "#5E6670", accentInk: "#4A515A" },
  },
];

export const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c])) as Record<
  CategorySlug,
  Category
>;

export function isCategorySlug(value: string | null | undefined): value is CategorySlug {
  return !!value && (CATEGORY_SLUGS as readonly string[]).includes(value);
}

/** Parse a `?category=` value; anything unknown falls back to "all". */
export function parseFilter(value: string | null | undefined): Filter {
  return isCategorySlug(value) ? value : "all";
}

export function themeFor(filter: Filter): CategoryTheme {
  return filter === "all" ? ALL_THEME : categoryBySlug[filter].theme;
}

export function filterLabel(filter: Filter): string {
  return filter === "all" ? "All" : categoryBySlug[filter].filterLabel;
}
