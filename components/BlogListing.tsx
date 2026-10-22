"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { Post } from "@/lib/posts";
import { getReadingTimeMinutes } from "@/lib/reading-time";
import { categories, categoryPath } from "@/lib/category-url";

export function BlogListing({ posts, heading, description }: { posts: Post[]; heading: string; description: string }) {
  const [query, setQuery] = useState("");
  const activeCategory = categories.find((category) => category === heading);
  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return posts;
    return posts.filter((post) =>
      [post.title, post.category, post.excerpt, ...post.tags]
        .some((field) => field.toLowerCase().includes(normalizedQuery)),
    );
  }, [posts, query]);
  const [featuredPost, ...morePosts] = filteredPosts;
  return (
    <main className="mx-auto min-h-[55vh] max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
      <section className="border-b border-slate-200 pb-8 sm:pb-10">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#008f5a]">EarnPouch guides</p>
        <h1 className="editorial-serif mt-3 text-4xl leading-tight text-slate-950 sm:text-5xl">{heading}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{description}</p>
        <nav aria-label="Browse guides by category" className="mt-7 flex gap-2 overflow-x-auto pb-1">
          <Link href="/blog" aria-current={!activeCategory ? "page" : undefined} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${!activeCategory ? "border-[#00a86b] bg-[#00a86b] text-white" : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-[#008f5a]"}`}>All guides</Link>
          {categories.map((category) => <Link key={category} href={categoryPath(category)} aria-current={activeCategory === category ? "page" : undefined} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${activeCategory === category ? "border-[#00a86b] bg-[#00a86b] text-white" : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-[#008f5a]"}`}>{category}</Link>)}
        </nav>
      </section>
      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500" aria-live="polite">
          {filteredPosts.length} {filteredPosts.length === 1 ? "guide" : "guides"} to explore
        </p>
        <div className="relative w-full sm:max-w-sm">
          <label htmlFor="guide-search" className="sr-only">Search guides</label>
          <Search size={17} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="guide-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search guides by topic or keyword"
            className="min-h-11 w-full rounded-full border border-slate-300 bg-white py-2 pl-10 pr-10 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#00a86b] focus:ring-2 focus:ring-emerald-100"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear guide search"
              className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#008f5a]"
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
      {featuredPost ? (
        <>
          <article className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <Link href={`/blog/${featuredPost.slug}`} aria-label={`Read ${featuredPost.title}`} className="group grid md:grid-cols-2">
              {featuredPost.coverImage ? (
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-100 md:aspect-auto md:min-h-80">
                  <Image src={featuredPost.coverImage} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
                </div>
              ) : <div className="aspect-[16/9] bg-gradient-to-br from-emerald-100 via-sky-50 to-slate-100 md:min-h-80" aria-hidden="true" />}
              <div className="flex flex-col justify-center p-6 sm:p-9">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold uppercase tracking-wider text-[#008f5a]">
                  <span>{featuredPost.category}</span><span className="text-slate-300" aria-hidden="true">/</span>
                  <time dateTime={featuredPost.date}>{featuredPost.date}</time><span className="text-slate-300" aria-hidden="true">/</span>
                  <span>{getReadingTimeMinutes(featuredPost.content)} min read</span>
                </div>
                <h2 className="editorial-serif mt-3 text-3xl leading-tight text-slate-950 transition-colors group-hover:text-[#008f5a] sm:text-4xl">{featuredPost.title}</h2>
                <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">{featuredPost.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#008f5a]">Read the guide <ArrowRight size={15} /></span>
              </div>
            </Link>
          </article>
          {morePosts.length > 0 && (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {morePosts.map((post) => (
                <article key={post.slug} className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-md">
                  <Link href={`/blog/${post.slug}`} className="group block" aria-label={`Read ${post.title}`}>
                    {post.coverImage ? (
                      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                        <Image src={post.coverImage} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-300 group-hover:scale-[1.03]" />
                      </div>
                    ) : <div className="aspect-[16/9] bg-gradient-to-br from-emerald-100 via-sky-50 to-slate-100" aria-hidden="true" />}
                    <div className="p-5">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold uppercase tracking-wider text-[#008f5a]">
                        <span>{post.category}</span><span className="text-slate-300" aria-hidden="true">/</span>
                        <time dateTime={post.date}>{post.date}</time><span className="text-slate-300" aria-hidden="true">/</span>
                        <span>{getReadingTimeMinutes(post.content)} min read</span>
                      </div>
                      <h2 className="editorial-serif mt-3 text-2xl leading-tight text-slate-950 transition-colors group-hover:text-[#008f5a]">{post.title}</h2>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{post.excerpt}</p>
                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#008f5a]">Read guide <ArrowRight size={15} /></span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </>
      ) : query ? (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center sm:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#008f5a]">No matching guides</p>
          <h2 className="editorial-serif mt-2 text-2xl text-slate-950">Try a different search.</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">Search by a brand, topic, or category, or clear the search to see every guide.</p>
          <button type="button" onClick={() => setQuery("")} className="mt-5 rounded-full bg-[#00a86b] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#008f5a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008f5a]">Clear search</button>
        </section>
      ) : (
        <section className="mt-8 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 px-6 py-10 text-center sm:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">More guides are on the way</p>
          <h2 className="editorial-serif mt-2 text-2xl text-slate-950">We&apos;re building this section.</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">In the meantime, explore the latest EarnPouch guides or choose another topic.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Link href="/blog" className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800">Browse all guides</Link>
            {categories.filter((category) => category !== activeCategory).map((category) => (
              <Link key={category} href={categoryPath(category)} className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-emerald-400 hover:text-emerald-800">{category}</Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
