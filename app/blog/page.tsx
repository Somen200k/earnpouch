import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BlogListing } from "@/components/BlogListing";
import { categories, categoryPath } from "@/lib/category-url";
import { listPosts } from "@/lib/posts";

export const metadata: Metadata = { title: "All guides", description: "Explore practical guides to reward apps, side hustles, budgeting, and remote work." };

export default async function BlogIndex({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const allPosts = listPosts();
  if (category) {
    const matchingCategory = categories.find((item) => item.toLowerCase() === category.toLowerCase());
    if (matchingCategory) redirect(categoryPath(matchingCategory));
  }
  const posts = category ? allPosts.filter((post) => post.category.toLowerCase() === category.toLowerCase()) : allPosts;
  return <BlogListing
    posts={posts}
    heading={category ?? "Guides for your next money move"}
    description="Practical, carefully researched reads to help you earn, save, and make more confident decisions."
  />;
}