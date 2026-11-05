"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { navLinks, studio } from "@/data/site";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/animations/gsap";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";

/** Event other components dispatch when a section's light/dark theme changes in place. */
export const THEME_EVENT = "ev:theme";

export function Header() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [tone, setTone] = useState<"light" | "dark">("light");
  const [menuOpen, setMenuOpen] = useState(false);

  // Hide on scroll down, reveal on scroll up.
  useGSAP(
    () => {
      const header = headerRef.current!;
      let hidden = false;
      const setHidden = (next: boolean) => {
        if (next === hidden) return;
        hidden = next;
        gsap.to(header, { yPercent: next ? -110 : 0, duration: 0.8, ease: "expo.out" });
      };
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => setHidden(self.direction === 1 && self.scroll() > 160),
      });
      header.addEventListener("focusin", () => setHidden(false));
    },
    { scope: headerRef },
  );

  // Match the header colour to whichever [data-theme] section sits beneath it.
  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>("[data-theme]")];
    const under = new Set<Element>();
    const update = () => {
      let next: "light" | "dark" = "light";
      for (const s of sections) if (under.has(s)) next = s.dataset.theme === "dark" ? "dark" : "light";
      setTone(next);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) under.add(e.target);
          else under.delete(e.target);
        }
        update();
      },
      { rootMargin: "-4% 0px -95% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    window.addEventListener(THEME_EVENT, update);
    return () => {
      observer.disconnect();
      window.removeEventListener(THEME_EVENT, update);
    };
  }, [pathname]);

  const isActive = (href: string) => href === "/work" && pathname.startsWith("/work");

  return (
    <>
      <header ref={headerRef} data-on={menuOpen ? "dark" : tone} className="site-header fixed inset-x-0 top-0 z-50">
        <div className="container-x flex items-center justify-between py-5 md:py-6">
          <TransitionLink href="/" className="relative z-10 flex items-baseline gap-2" aria-label={`${studio.name} — home`}>
            <span className="font-serif text-[1.625rem] leading-none md:text-[1.875rem]">{studio.shortName}</span>
            <span className="label hidden sm:inline">Studio</span>
          </TransitionLink>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-8 lg:gap-10">
              {navLinks.slice(0, 4).map((link) => (
                <li key={link.href}>
                  <Magnetic>
                    <TransitionLink
                      href={link.href}
                      className="label u-link py-2"
                      aria-current={isActive(link.href) ? "page" : undefined}
                    >
                      {link.label}
                    </TransitionLink>
                  </Magnetic>
                </li>
              ))}
              <li>
                <Magnetic strength={0.4}>
                  <TransitionLink
                    href="/#contact"
                    className="label block rounded-full border border-current px-5 py-2.5 transition-colors duration-500 hover:border-champagne hover:bg-champagne hover:text-ink"
                  >
                    Inquire
                  </TransitionLink>
                </Magnetic>
              </li>
            </ul>
          </nav>

          <button
            type="button"
            className={cn("label relative z-10 py-2 md:hidden")}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
