import type Lenis from "lenis";

/** Shared handle to the Lenis instance (null under reduced motion). */
export const scroller: { lenis: Lenis | null } = { lenis: null };

export function stopScroll() {
  scroller.lenis?.stop();
}

export function startScroll() {
  scroller.lenis?.start();
}

/** Scroll to a y-position or element, smoothly when Lenis is running. */
export function scrollTo(target: number | string | HTMLElement, options: { immediate?: boolean } = {}) {
  const { lenis } = scroller;
  if (lenis) {
    lenis.scrollTo(target, { immediate: options.immediate, force: true, duration: 1.6 });
    return;
  }
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  const top =
    typeof el === "number" ? el : el instanceof HTMLElement ? el.getBoundingClientRect().top + window.scrollY : 0;
  window.scrollTo({ top, behavior: options.immediate ? "instant" : "smooth" });
}
