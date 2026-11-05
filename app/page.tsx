import type { Metadata } from "next";
import { FilterableGallery } from "@/components/gallery/FilterableGallery";
import { SplitReveal } from "@/components/motion/SplitReveal";
import {
  featuredProject,
  heroSlides,
  journalPhotos,
  portrait,
  selectedGallery,
  serviceCovers,
  toLightboxItems,
} from "@/data/projects";
import { studio } from "@/data/site";
import { About } from "@/sections/About";
import { Contact } from "@/sections/Contact";
import { FeaturedStory } from "@/sections/FeaturedStory";
import { Hero } from "@/sections/Hero";
import { Intro } from "@/sections/Intro";
import { Journal } from "@/sections/Journal";
import { Services } from "@/sections/Services";
import { Testimonials } from "@/sections/Testimonials";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: studio.name,
  description: studio.description,
  url: studio.url,
  email: studio.email,
  telephone: studio.phone,
  image: heroSlides[0].photo.src,
  address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressRegion: "Karnataka", addressCountry: "IN" },
  areaServed: ["Bengaluru", "Karnataka", "India"],
  priceRange: "££££",
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero slides={heroSlides} />
      <Intro />
      <FilterableGallery
        id="work"
        set={selectedGallery}
        showViewAll
        className="py-[14vh]"
        intro={
          <div className="grid-12 mb-12 items-end gap-y-6 md:mb-16">
            <p className="label col-span-12 text-[var(--g-muted)] md:col-span-3">(02) — Selected work</p>
            <SplitReveal as="h2" className="col-span-12 font-serif text-h1 md:col-span-6">
              Moments, <em className="italic">kept</em>
            </SplitReveal>
            <p className="col-span-12 text-[var(--g-muted)] md:col-span-3">
              Every event has its own mood — choose one and the gallery rearranges itself to match.
            </p>
          </div>
        }
      />
      <FeaturedStory project={featuredProject} lightboxItems={toLightboxItems(featuredProject)} />
      <Services covers={serviceCovers} />
      <About portrait={portrait} />
      <Testimonials />
      <Journal photos={journalPhotos} />
      <Contact />
    </>
  );
}
