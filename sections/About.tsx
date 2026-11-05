import { RevealImage } from "@/components/motion/RevealImage";
import { SplitReveal } from "@/components/motion/SplitReveal";
import type { Photo } from "@/data/types";
import { about } from "@/data/site";

export function About({ portrait }: { portrait: Photo }) {
  return (
    <section id="about" data-theme="light" className="container-x py-[16vh]">
      <div className="grid-12 gap-y-14">
        <div className="col-span-12 md:col-span-5">
          <RevealImage photo={portrait} ratio={4 / 5} sizes="(min-width: 768px) 40vw, 100vw" objectPosition="62% 50%" />
          <p className="label mt-4 text-stone-deep">Chirag Photography · Bengaluru</p>
        </div>

        <div className="col-span-12 flex flex-col md:col-span-6 md:col-start-7">
          <p className="label text-stone-deep">(05) — About</p>
          <SplitReveal as="h2" className="mt-6 font-serif text-h1">
            {about.heading[0]} <em className="italic">{about.heading[1]}</em>
          </SplitReveal>
          <div className="mt-10 space-y-5 text-lg text-ink/80 md:max-w-[46ch]">
            {about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-ink/15 pt-8">
            {about.stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-serif text-h2">{s.value}</dd>
                <dd className="mt-2 text-sm text-stone-deep">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-24 border-t border-ink/15 pt-8 md:mt-32">
        <p className="label text-stone-deep">Photography for every occasion</p>
        <ul className="mt-6 flex flex-wrap items-baseline gap-x-10 gap-y-4">
          {about.press.map((name, i) => (
            <li key={name} className={i % 2 ? "label text-base tracking-[0.3em]" : "font-serif text-3xl italic"}>
              {name}
            </li>
          ))}
        </ul>
      </div>

    </section>
  );
}
