import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { RevealImage } from "@/components/motion/RevealImage";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { ProjectGallery } from "@/components/work/ProjectGallery";
import { categoryBySlug } from "@/data/categories";
import { getNextProject, getProject, projects, toLightboxItems } from "@/data/projects";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  const cover = project.photos[0];
  return {
    title: `${project.title} — ${categoryBySlug[project.category].label}`,
    description: project.excerpt,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.excerpt,
      images: [{ url: `${cover.src}?auto=format&fit=crop&w=1200&h=630&q=75`, width: 1200, height: 630, alt: cover.alt }],
    },
  };
}

export default async function ProjectPage({ params }: Params) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const category = categoryBySlug[project.category];
  const next = getNextProject(project.slug);
  const items = toLightboxItems(project);
  const accentStyle = { "--accent": category.theme.accent, "--accent-ink": category.theme.accentInk } as CSSProperties;

  const facts = [
    ["Event type", category.label],
    ["Client", project.client],
    ["Location", project.location],
    ["Year", String(project.year)],
    ["Venue", project.venue],
    ["Guests", project.guests],
  ];

  return (
    <article style={accentStyle}>
      {/* Hero */}
      <header data-theme="dark" className="relative h-[100svh] min-h-[560px] overflow-hidden bg-charcoal text-paper">
        <div className="absolute inset-0">
          <RevealImage
            photo={project.photos[0]}
            sizes="100vw"
            ratio="fill"
            reveal="page"
            preload
            critical
            className="h-full"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/65" />
        <div className="relative flex h-full flex-col justify-end container-x pb-10 md:pb-14">
          <p className="label mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-[var(--accent)]" aria-hidden="true" />
            {category.label} — {project.location}
          </p>
          <SplitReveal as="h1" on="page" by="words" className="max-w-[14ch] font-serif text-display">
            {project.title}
          </SplitReveal>
        </div>
      </header>

      {/* Facts + story */}
      <section data-theme="light" className="container-x py-[14vh]">
        <dl className="grid grid-cols-2 gap-x-[var(--col-gap)] gap-y-8 border-t border-ink/15 pt-8 md:grid-cols-6">
          {facts.map(([term, value]) => (
            <div key={term}>
              <dt className="label text-stone-deep">{term}</dt>
              <dd className="mt-2 font-serif text-xl">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="grid-12 mt-[12vh] gap-y-10">
          <p className="label col-span-12 text-[var(--accent-ink)] md:col-span-3">The story</p>
          <div className="col-span-12 md:col-span-8">
            <SplitReveal as="p" className="font-serif text-lead">
              {project.story[0]}
            </SplitReveal>
            <div className="mt-12 grid gap-8 text-lg text-ink/80 md:grid-cols-2">
              {project.story.slice(1).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section data-theme="light" aria-label="Gallery" className="container-x pb-[16vh]">
        <ProjectGallery items={items} />
      </section>

      {/* Next project */}
      <section data-theme="dark" className="bg-charcoal text-paper">
        <TransitionLink href={`/work/${next.slug}`} className="group block container-x py-[12vh]" data-cursor="Next">
          <p className="label text-stone">Next project — {categoryBySlug[next.category].label}</p>
          <div className="mt-8 grid-12 items-end gap-y-10">
            <h2 className="col-span-12 font-serif text-display md:col-span-6">
              <span className="u-link">{next.title}</span>
            </h2>
            <div className="relative col-span-12 aspect-[16/10] overflow-hidden md:col-span-6">
              <Image
                src={next.photos[0].src}
                alt={next.photos[0].alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                placeholder={next.photos[0].blurDataURL ?? "empty"}
                className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-expo)] group-hover:scale-105"
              />
            </div>
          </div>
        </TransitionLink>
      </section>
    </article>
  );
}
