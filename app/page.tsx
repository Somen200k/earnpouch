import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, BadgeCheck, ShieldCheck } from "lucide-react";
import { listPosts } from "@/lib/posts";
import { readSiteSettings } from "@/lib/site-settings";
import { categoryPath } from "@/lib/category-url";

export default function Home() {
  const settings = readSiteSettings();
  const categories = settings.categories.map((category, index) => ({ ...category, number: String(index + 1).padStart(2, "0") }));
  const allPosts = listPosts();
  const posts = allPosts.slice(0, 3);
  const featured = posts[0];
  const featuredImage = featured?.coverImage ?? "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=85";

  return <main>
    <section className="relative isolate overflow-hidden border-b border-emerald-200 bg-[#edf5f0]">
      <div className="absolute inset-y-0 right-0 hidden w-[47%] lg:block" aria-hidden="true"><Image src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=85" alt="" fill sizes="47vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-[#edf5f0] via-[#edf5f0]/35 to-transparent" /></div>
      <div className="mx-auto max-w-7xl px-5 py-5 sm:hidden">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.13em] text-emerald-900"><span className="h-2 w-2 rounded-full bg-emerald-600" /><span>{settings.heroBadge}</span></div>
        <h1 className="editorial-serif mt-3 text-[42px] leading-[0.98] text-slate-950">{settings.heroTitle}</h1>
        <p className="mt-3 max-w-lg text-sm leading-6 text-slate-700">{settings.heroSubtitle}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2"><Link href="#latest" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-green-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-green-700">Explore the latest <ArrowRight size={17} /></Link><Link href="/blog" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-slate-800 underline decoration-emerald-600 decoration-2 underline-offset-4 hover:text-blue-700">Browse all guides <ArrowUpRight size={15} /></Link></div>
        <Link href={featured ? `/blog/${featured.slug}` : "/blog"} aria-label={featured ? `Read ${featured.title}` : "Browse EarnPouch guides"} className="group relative mt-5 block aspect-[1.75/1] overflow-hidden border-l-[3px] border-emerald-600 bg-slate-300">
          <Image src={featuredImage} alt="" fill priority sizes="100vw" className="object-cover object-center transition duration-700 group-hover:scale-[1.02]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-[18%] border border-white/70 bg-white/95 p-3 shadow-lg"><span className="block text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-700">Editor&apos;s starting point</span><h2 className="editorial-serif mt-1 line-clamp-2 text-base leading-tight text-slate-950">{featured?.title ?? "Small steps for a steadier month."}</h2><span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-700">Read the guide <ArrowRight size={13} /></span></div>
        </Link>
        <div className="mt-3 flex items-center gap-2 border-t border-emerald-200 pt-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-600"><BadgeCheck size={15} className="shrink-0 text-blue-700" /><span>{settings.tagline}</span></div>
      </div>
      <div className="relative mx-auto hidden max-w-7xl px-5 py-5 sm:block sm:px-8 sm:py-10 lg:px-12 lg:py-14">
        <div className="grid grid-cols-[minmax(0,1.15fr)_minmax(120px,0.85fr)] gap-x-3 gap-y-3 sm:grid-cols-[minmax(0,1fr)_minmax(300px,0.9fr)] sm:gap-x-12 sm:gap-y-6">
          <div className="col-start-1 row-start-1 self-end">
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.13em] text-emerald-900 sm:mb-5 sm:text-xs"><span className="border-y border-emerald-700 py-1">EP / 01</span><span className="h-px w-5 bg-emerald-700 sm:w-8" /><span>{settings.heroBadge}</span></div>
            <h1 className="editorial-serif text-[36px] leading-[0.98] text-slate-950 sm:text-6xl lg:text-7xl">{settings.heroTitle}</h1>
          </div>
          <Link href={featured ? `/blog/${featured.slug}` : "/blog"} aria-label={featured ? `Read ${featured.title}` : "Browse EarnPouch guides"} className="group relative col-start-2 row-start-1 min-h-[174px] overflow-hidden border-l-[3px] border-emerald-600 bg-slate-300 sm:row-span-2 sm:min-h-[400px] sm:border-l-4 lg:hidden">
            <Image src={featuredImage} alt="" fill priority sizes="(max-width: 640px) 42vw, (max-width: 1024px) 40vw, 42vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" />
            <div className="absolute bottom-2 left-2 right-2 border border-white/70 bg-white/95 p-2 shadow-lg sm:bottom-4 sm:left-4 sm:right-4 sm:p-4 lg:hidden"><span className="block text-[8px] font-bold uppercase tracking-[0.1em] text-emerald-700 sm:text-[10px]">Editor&apos;s starting point</span><span className="editorial-serif mt-1 line-clamp-2 block text-xs leading-tight text-slate-950 sm:text-lg">{featured?.title}</span><span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 sm:mt-2 sm:text-sm">Read the guide <ArrowRight size={12} /></span></div>
          </Link>
          <div className="col-span-2 col-start-1 row-start-2 max-w-xl sm:col-span-1 sm:row-start-2">
            <p className="max-w-lg text-sm leading-6 text-slate-700 sm:text-lg sm:leading-8">{settings.heroSubtitle}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 sm:mt-7"><Link href="#latest" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-green-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-green-700 sm:px-5">Explore the latest <ArrowRight size={17} /></Link><Link href="/blog" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-slate-800 underline decoration-emerald-600 decoration-2 underline-offset-4 hover:text-blue-700">Browse all guides <ArrowUpRight size={15} /></Link></div>
            <div className="mt-4 flex items-center gap-2 border-t border-emerald-200 pt-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-600 sm:mt-7 sm:gap-3 sm:pt-4 sm:text-xs"><BadgeCheck size={15} className="shrink-0 text-blue-700" /><span>{settings.tagline}</span><ShieldCheck size={15} className="hidden shrink-0 text-emerald-700 sm:block" /></div>
          </div>
        </div>
        {featured && <Link href={`/blog/${featured.slug}`} className="absolute bottom-10 left-8 hidden max-w-sm border border-white/70 bg-white/95 p-5 shadow-xl backdrop-blur-sm transition hover:-translate-y-1 lg:left-auto lg:right-12 lg:block"><span className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-700">Editor&apos;s starting point</span><h2 className="editorial-serif mt-2 text-2xl leading-tight">{featured.title}</h2><span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">Read the guide <ArrowRight size={15} /></span></Link>}
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20"><div className="mb-8 flex items-end justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Find your next step</p><h2 className="editorial-serif mt-2 text-3xl sm:text-4xl">Explore by interest</h2></div><span className="hidden text-sm text-slate-500 sm:block">Useful reads for everyday money decisions</span></div>
      <div className="grid divide-y divide-slate-200 border-y border-slate-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3 xl:grid-cols-5">{categories.map((category) => <Link href={categoryPath(category.name)} key={category.number} className="group py-6 sm:px-5 sm:first:pl-0 lg:px-4"><span className="flex items-center justify-between text-xs font-bold tracking-[0.12em] text-blue-700"><span>{category.number}</span><ArrowUpRight size={16} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span><h3 className="mt-5 text-lg font-bold group-hover:text-blue-700">{category.name}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p></Link>)}</div>
    </section>
    <section id="latest" className="border-y border-slate-200 bg-white"><div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20"><div className="mb-9 flex items-end justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Fresh from the editors</p><h2 className="editorial-serif mt-2 text-3xl sm:text-4xl">The latest guides</h2></div><Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900">All articles <ArrowRight size={16} /></Link></div>
      {posts.length ? <div className="grid gap-6 md:grid-cols-3">{posts.map((post, index) => <article key={post.slug} className="group flex flex-col border border-slate-200 bg-slate-50"><Link href={`/blog/${post.slug}`} className="relative block aspect-[1.65] overflow-hidden bg-emerald-50">{post.coverImage ? <Image src={post.coverImage} alt="" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" /> : <div className={`h-full w-full ${index === 1 ? "bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80')]" : "bg-[url('https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=900&q=80')]"} bg-cover bg-center`} />}<span className="absolute left-4 top-4 bg-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-800">{post.category}</span></Link><div className="flex flex-1 flex-col p-5"><p className="text-xs text-slate-500">{new Date(`${post.date}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p><h3 className="editorial-serif mt-3 text-2xl leading-tight"><Link href={`/blog/${post.slug}`} className="hover:text-blue-700">{post.title}</Link></h3><p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{post.excerpt}</p><Link href={`/blog/${post.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700">Read the guide <ArrowRight size={15} /></Link></div></article>)}</div> : <div className="border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">New guides are on the way. Check back soon.</div>}</div></section>
    <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12"><div className="flex flex-col justify-between gap-5 border-l-4 border-emerald-500 bg-emerald-50/80 px-6 py-5 sm:flex-row sm:items-center"><div><p className="font-bold text-slate-900">Recommendations should be useful, not mysterious.</p><p className="mt-1 text-sm text-slate-600">{settings.affiliateNotice}</p></div><Link href="/affiliate-disclosure" className="shrink-0 text-sm font-bold text-blue-700 hover:underline">How we make money <ArrowRight className="ml-1 inline" size={14} /></Link></div></section>
  </main>;
}
