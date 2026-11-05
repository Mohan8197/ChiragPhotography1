import type { MetadataRoute } from "next";
import { studio } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${studio.url}/sitemap.xml`,
  };
}
