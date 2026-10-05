import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogListing } from "@/components/BlogListing";
import { categories, categoryFromSlug, categorySlug } from "@/lib/category-url";
import { listPosts } from "@/lib/posts";

type PageProps = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return categories.map((category) => ({ category: categorySlug(category) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = categoryFromSlug(slug);
  if (!category) return {};
  const hasPublishedPosts = listPosts().some((post) => post.category === category);
  return {
    title: `${category} guides`,
    description: `Browse EarnPouch guides in ${category}.`,
    alternates: { canonical: `/blog/category/${slug}` },
    ...(hasPublishedPosts ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: slug } = await params;
  const category = categoryFromSlug(slug);
  if (!category) notFound();
  return <BlogListing
    posts={listPosts().filter((post) => post.category === category)}
    heading={category}
    description={`Browse practical EarnPouch guides in ${category}. Check each provider's current requirements and terms before taking action.`}
  />;
}
