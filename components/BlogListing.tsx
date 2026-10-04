import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Post } from "@/lib/posts";

export function BlogListing({ posts, heading, description }: { posts: Post[]; heading: string; description: string }) {
  return (
    <main className="mx-auto min-h-[55vh] max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">The EarnPouch library</p>
      <h1 className="editorial-serif mt-3 text-4xl sm:text-5xl">{heading}</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{description}</p>
      {posts.length ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.slug} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <Link href={`/blog/${post.slug}`} className="group block" aria-label={`Read ${post.title}`}>
                {post.coverImage ? (
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                    <Image src={post.coverImage} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-300 group-hover:scale-[1.03]" />
                  </div>
                ) : <div className="aspect-[16/9] bg-gradient-to-br from-emerald-100 via-sky-50 to-slate-100" aria-hidden="true" />}
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">{post.category} <span className="mx-1.5 text-slate-300">/</span> {post.date}</p>
                  <h2 className="editorial-serif mt-3 text-2xl leading-tight text-slate-950 group-hover:text-blue-700">{post.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{post.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-700">Read guide <ArrowRight size={15} /></span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      ) : <p className="mt-10 border-y border-slate-200 py-8 text-slate-600">No guides found in this category yet.</p>}
    </main>
  );
}
