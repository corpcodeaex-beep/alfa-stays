import type { MetadataRoute } from "next";
import { apartments } from "@/lib/apartments";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, priority: 1 },
    { url: `${site.url}/apartments`, priority: 0.9 },
    { url: `${site.url}/contact`, priority: 0.6 },
    ...apartments.map((a) => ({ url: `${site.url}/apartments/${a.slug}`, priority: 0.8 })),
  ];
}
