import type { CategorySlug, Filter } from "./categories";

export interface Photo {
  id: string;
  src: string;
  alt: string;
  caption: string;
  credit: string;
  width: number;
  height: number;
  /** Tiny GIF data URL, used directly as the loading placeholder */
  blurDataURL?: `data:image/${string}`;
}

export interface Project {
  slug: string;
  title: string;
  category: CategorySlug;
  client: string;
  venue: string;
  location: string;
  year: number;
  guests: string;
  excerpt: string;
  story: string[];
  photos: Photo[];
}

/** The slim slice of a project that travels with every gallery photo. */
export type ProjectRef = Pick<Project, "slug" | "title" | "client" | "location" | "year" | "category">;

export interface GalleryItem {
  key: string;
  photo: Photo;
  category: CategorySlug;
  project: ProjectRef;
}

export interface GallerySet {
  /** Ordered item keys for each filter */
  order: Record<Filter, string[]>;
  /** Every item that appears in any filter, once */
  pool: GalleryItem[];
}

/** What the lightbox needs to show a frame. */
export interface LightboxItem {
  photo: Photo;
  title: string;
  meta: string;
}
