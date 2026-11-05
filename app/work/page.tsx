import type { Metadata } from "next";
import { FilterableGallery } from "@/components/gallery/FilterableGallery";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { ProjectIndex } from "@/components/work/ProjectIndex";
import { fullGallery, projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "The full archive — weddings, engagements, birthdays, parties, baby showers and corporate events, each with a gallery layout to match its mood.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <FilterableGallery
        id="archive"
        set={fullGallery}
        className="pt-36 pb-[14vh] md:pt-48"
        intro={
          <div className="grid-12 mb-14 items-end gap-y-8 md:mb-20">
            <SplitReveal as="h1" on="page" className="col-span-12 font-serif text-display md:col-span-8">
              The <em className="italic">work</em>
            </SplitReveal>
            <p className="col-span-12 text-[var(--g-muted)] md:col-span-4">
              {fullGallery.pool.length} frames from {projects.length} stories. Pick an event type — the archive
              rearranges itself to suit the mood.
            </p>
          </div>
        }
      />
      <ProjectIndex
        projects={projects.map(({ slug, title, category, location, year, photos }) => ({
          slug,
          title,
          category,
          location,
          year,
          cover: photos[0],
        }))}
      />
    </>
  );
}
