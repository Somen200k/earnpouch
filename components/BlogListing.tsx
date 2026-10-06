import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Post } from "@/lib/posts";
import { categories, categoryPath } from "@/lib/category-url";

export function BlogListing({ posts, heading, description }: { posts: Post[]; heading: string; description: string }) {
  const activeCategory = categories.find((category) => category === heading);
  return (
    <main className="mx-auto min-h-[55vh] max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <section className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-sky-50 px-6 py-8 sm:px-10 sm:py-10">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">The EarnPouch library</p>
        <h1 className="editorial-serif mt-3 text-4xl text-slate-950 sm:text-5xl">{heading}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{description}</p>
        <nav aria-label="Browse guides by category" className="mt-7 flex gap-2 overflow-x-auto pb-1">
          <Link href="/blog" aria-current={!activeCategory ? "page" : undefined} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${!activeCategory ? "border-emerald-800 bg-emerald-800 text-white" : "border-slate-200 bg-white/80 text-slate-700 hover:border-emerald-300 hover:text-emerald-800"}`}>All guides</Link>
          {categories.map((category) => <Link key={category} href={categoryPath(category)} aria-current={activeCategory === category ? "page" : undefined} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${activeCategory === category ? "border-emerald-800 bg-emerald-800 text-white" : "border-slate-200 bg-white/80 text-slate-700 hover:border-emerald-300 hover:text-emerald-800"}`}>{category}</Link>)}
        </nav>
      </section>
      <div className="mt-8 flex items-center justify-between border-b border-slate-200 pb-3 text-sm text-slate-500"><span>{posts.length} {posts.length === 1 ? "guide" : "guides"} to explore</span><span className="hidden sm:inline">Practical reads, organized around what matters to you</span></div>
      {posts.length ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
