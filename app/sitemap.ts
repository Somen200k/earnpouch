import type { MetadataRoute } from "next";
import { listPosts } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.earnpouch.com";
  const staticPages = ["", "/blog", "/privacy-policy", "/terms-of-service", "/affiliate-disclosure", "/contact"];
  return [
    ...staticPages.map((route) => ({ url: `${base}${route}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: route === "" ? 1 : 0.6 })),
    ...listPosts().map((post) => ({ url: `${base}/blog/${post.slug}`, lastModified: new Date(`${post.date}T12:00:00Z`), changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}