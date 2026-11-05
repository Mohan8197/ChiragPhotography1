import { SplitReveal } from "@/components/motion/SplitReveal";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { navLinks, socials, studio } from "@/data/site";
import { BackToTop } from "./FooterClient";

export function Footer() {
  return (
    <footer data-theme="dark" className="relative overflow-hidden bg-charcoal text-paper">
      <div className="container-x grid-12 gap-y-12 border-t border-paper/10 pt-16 pb-12 md:pt-24">
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          <h2 className="label mb-5 text-stone">Studio</h2>
          <address className="space-y-1 not-italic text-paper/85">
            {studio.address.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <a href="https://wa.me/919036343493" className="u-link mt-4 block w-fit font-serif text-2xl text-paper">
              WhatsApp us
            </a>
            <a href={`tel:${studio.phone.replace(/\s/g, "")}`} className="u-link block w-fit text-paper/85">
              {studio.phone}
            </a>
          </address>
        </div>

        <nav aria-label="Footer" className="col-span-6 sm:col-span-3 lg:col-span-2 lg:col-start-6">
          <h2 className="label mb-5 text-stone">Menu</h2>
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <TransitionLink href={link.href} className="u-link">
                  {link.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-6 sm:col-span-3 lg:col-span-2">
          <h2 className="label mb-5 text-stone">Follow</h2>
          <ul className="space-y-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="u-link">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-12 flex items-start justify-between gap-8 lg:col-span-3 lg:col-start-10 lg:justify-end">
          <p className="text-sm text-paper/70 lg:hidden">
            Bengaluru
          </p>
          <BackToTop />
        </div>
      </div>

      <div className="container-x" aria-hidden="true">
        <SplitReveal by="chars" className="font-serif text-mega whitespace-nowrap" start="top 95%" stagger={0.04}>
          {studio.shortName}
        </SplitReveal>
      </div>

      <div className="container-x flex flex-col gap-3 border-t border-paper/10 py-6 text-xs text-paper/60 md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {studio.name}. All rights reserved.
        </p>
        <p className="hidden lg:block">
          Bengaluru — {studio.availability}
        </p>
        <p>
          Photography by Chirag Photography
        </p>
      </div>
    </footer>
  );
}
