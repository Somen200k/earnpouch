import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { listPosts } from "@/lib/posts";

export const metadata: Metadata = { title: "All guides", description: "Explore practical guides to reward apps, side hustles, budgeting, and remote work." };

export default async function BlogIndex({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const allPosts = listPosts();
  const posts = category ? allPosts.filter((post) => post.category.toLowerCase() === category.toLowerCase()) : allPosts;
  return <main className="mx-auto min-h-[55vh] max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16"><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">The EarnPouch library</p><h1 className="editorial-serif mt-3 text-4xl sm:text-5xl">{category ?? "Guides for your next money move"}</h1><p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">Practical, carefully researched reads to help you earn, save, and make more confident decisions.</p>
    {posts.length ? <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{posts.map((post) => <article key={post.slug} className="border-t border-slate-200 pt-5"><p className="text-xs font-bold uppercase tracking-wider text-emerald-800">{post.category} <span className="mx-1.5 text-slate-300">/</span> {post.date}</p><h2 className="editorial-serif mt-3 text-2xl leading-tight"><Link href={`/blog/${post.slug}`} className="hover:text-blue-700">{post.title}</Link></h2><p className="mt-3 text-sm leading-6 text-slate-600">{post.excerpt}</p><Link href={`/blog/${post.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-700">Read guide <ArrowRight size={15} /></Link></article>)}</div> : <p className="mt-10 border-y border-slate-200 py-8 text-slate-600">No guides found in this category yet.</p>}
    <script dangerouslySetInnerHTML={{ __html: "(function(s){s.dataset.zone='11932119',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))" }} />
  </main>;
}