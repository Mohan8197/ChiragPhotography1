"use client";

interface LoaderProps {
  src: string;
  width: number;
  quality?: number;
}

/** next/image loader for images.unsplash.com (imgix): resize, auto-format, strip colour profile. */
export default function unsplashLoader({ src, width, quality }: LoaderProps): string {
  if (src.startsWith("/")) return src;
  const url = new URL(src);
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  url.searchParams.set("cs", "tinysrgb");
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  return url.toString();
}
