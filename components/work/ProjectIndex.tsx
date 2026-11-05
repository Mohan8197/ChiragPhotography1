import Image from "next/image";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { categoryBySlug, type CategorySlug } from "@/data/categories";
import type { Photo } from "@/data/types";
import { pad } from "@/lib/utils";

interface Row {
  slug: string;
  title: string;
  category: CategorySlug;
  location: string;
  year: number;
  cover: Photo;
}

/** Index of every story; hovering a row wipes in its cover. */
export function ProjectIndex({ projects }: { projects: Row[] }) {
  return (
    <section data-theme="light" aria-labelledby="index-title" className="container-x pb-[16vh]">
      <h2 id="index-title" className="label mb-8 text-stone-deep">
        Index — {projects.length} stories
      </h2>
      <ul>
        {projects.map((p, i) => (
          <li key={p.slug} className="border-t border-ink/15 last:border-b">
            <TransitionLink
              href={`/work/${p.slug}`}
              className="group relative grid grid-cols-12 items-center gap-x-[var(--col-gap)] py-5 md:py-6"
            >
              <span className="label col-span-2 text-stone-deep tabular-nums md:col-span-1">{pad(i + 1)}</span>
              <span className="col-span-10 font-serif text-3xl transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-4 md:col-span-5 md:text-4xl">
                {p.title}
              </span>
              <span className="label col-span-10 col-start-3 mt-2 text-stone-deep md:col-span-2 md:col-start-auto md:mt-0">
                {categoryBySlug[p.category].label}
              </span>
              <span className="col-span-10 col-start-3 text-sm text-stone-deep md:col-span-3 md:col-start-auto">
                {p.location}
              </span>
              <span className="label hidden text-right tabular-nums md:col-span-1 md:block">{p.year}</span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-[18%] z-10 hidden aspect-[4/5] w-40 -translate-y-1/2 overflow-hidden transition-[clip-path] duration-700 ease-[var(--ease-expo)] [clip-path:inset(100%_0_0_0)] group-hover:[clip-path:inset(0_0_0_0)] lg:block"
              >
                <Image src={p.cover.src} alt="" fill sizes="160px" quality={60} className="object-cover" />
              </span>
            </TransitionLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
