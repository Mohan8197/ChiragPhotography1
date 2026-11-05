import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { studio } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: studio.url, changeFrequency: "monthly", priority: 1 },
    { url: `${studio.url}/work`, changeFrequency: "monthly", priority: 0.9 },
    ...projects.map((p) => ({ url: `${studio.url}/work/${p.slug}`, changeFrequency: "yearly" as const, priority: 0.7 })),
  ];
}
