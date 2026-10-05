import type { MetadataRoute } from "next";
import { categories, categoryPath } from "@/lib/category-url";
import { listPosts } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.earnpouch.com";
  const staticPages = ["", "/blog", "/privacy-policy", "/terms-of-service", "/affiliate-disclosure", "/contact"];
  const posts = listPosts();
  // Keep empty category routes available, but omit thin listings from the sitemap until they have content.
  const populatedCategories = categories.filter((category) => posts.some((post) => post.category === category));
  return [
    ...staticPages.map((route) => ({ url: `${base}${route}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: route === "" ? 1 : 0.6 })),
    ...populatedCategories.map((category) => ({ url: `${base}${categoryPath(category)}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 })),
    ...posts.map((post) => ({ url: `${base}/blog/${post.slug}`, lastModified: new Date(`${post.date}T12:00:00Z`), changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}