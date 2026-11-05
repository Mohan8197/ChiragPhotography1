"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/animations/gsap";
import { pageReveal } from "@/lib/animations/page-reveal";
import { scroller, scrollTo, startScroll, stopScroll } from "@/lib/scroll";
import { prefersReducedMotion } from "@/lib/utils";

type Navigate = (href: string) => void;

const TransitionContext = createContext<Navigate>(() => {});

export const useNavigate = () => useContext(TransitionContext);

/**
 * Route transitions: a charcoal curtain wipes up over the page, the route
 * changes underneath it, then the curtain continues up and off the new page.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const curtainRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLParagraphElement>(null);
  const pending = useRef<{ hash: string } | null>(null);
  const busy = useRef(false);

  const navigate = useCallback<Navigate>(
    (href) => {
      const url = new URL(href, window.location.href);
      const here = window.location;

      // Same page: only the query (gallery filter) or hash changed.
      if (url.pathname === here.pathname) {
        if (url.search !== here.search) window.history.pushState(null, "", `${url.pathname}${url.search}`);
        if (url.hash) scrollTo(url.hash);
        else if (url.search === here.search) scrollTo(0);
        return;
      }

      if (busy.current) return;
      if (prefersReducedMotion()) {
        router.push(`${url.pathname}${url.search}${url.hash}`);
        return;
      }

      busy.current = true;
      pending.current = { hash: url.hash };
      pageReveal.hide();
      stopScroll();

      gsap
        .timeline()
        .set(curtainRef.current, { visibility: "visible" })
        .fromTo(
          curtainRef.current,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "expo.inOut" },
        )
        .fromTo(wordRef.current, { yPercent: 120 }, { yPercent: 0, duration: 0.9, ease: "expo.out" }, 0.35)
        .add(() => router.push(`${url.pathname}${url.search}`, { scroll: false }));
    },
    [router],
  );

  // The new route has committed: reset scroll beneath the curtain, then lift it.
  useEffect(() => {
    const transition = pending.current;
    if (!transition) return;
    pending.current = null;

    scroller.lenis?.resize();
    scrollTo(transition.hash || 0, { immediate: true });
    ScrollTrigger.refresh();

    gsap
      .timeline({
        onComplete: () => {
          gsap.set(curtainRef.current, { visibility: "hidden" });
          busy.current = false;
        },
      })
      .to(wordRef.current, { yPercent: -120, duration: 0.6, ease: "expo.in" })
      .to(
        curtainRef.current,
        {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 1.1,
          ease: "expo.inOut",
          onStart: () => {
            pageReveal.show();
            startScroll();
          },
        },
        0.3,
      );
  }, [pathname]);

  return (
    <TransitionContext value={navigate}>
      {children}
      <div ref={curtainRef} className="curtain" aria-hidden="true">
        <div className="overflow-hidden">
          <p ref={wordRef} className="font-serif text-h2 italic">
            Chirag Photography
          </p>
        </div>
      </div>
    </TransitionContext>
  );
}
