import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import { ComparisonTable } from "@/components/ComparisonTable";
import { MobileOfferBar } from "@/components/MobileOfferBar";
import { OfferCta } from "@/components/OfferCta";
import { QuickPickHero } from "@/components/QuickPickHero";
import { getPost, listPosts } from "@/lib/posts";
import { renderMarkdown } from "@/lib/render-markdown";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return listPosts().map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.excerpt, type: "article", publishedTime: post.date, images: post.coverImage ? [post.coverImage] : undefined },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt, images: post.coverImage ? [post.coverImage] : undefined },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const relatedPosts = listPosts()
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => ({
      post: candidate,
      relevance:
        (candidate.category === post.category ? 3 : 0) +
        candidate.tags.filter((tag) => post.tags.some((postTag) => postTag.toLowerCase() === tag.toLowerCase())).length * 2,
    }))
    .sort((first, second) => second.relevance - first.relevance || second.post.date.localeCompare(first.post.date))
    .slice(0, 3)
    .map(({ post: relatedPost }) => relatedPost);
  const html = await renderMarkdown(post.content);
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      author: { "@type": "Organization", name: "EarnPouch Editorial Team" },
      publisher: { "@type": "Organization", name: "EarnPouch" },
      mainEntityOfPage: `https://www.earnpouch.com/blog/${post.slug}`,
      ...(post.coverImage ? { image: [post.coverImage] } : {}),
    },
    ...(post.faqs.length ? [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: post.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }] : []),
  ];

  return <main className="pb-40 md:pb-0">{schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />)}
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12"><Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-700"><ArrowLeft size={15} /> All guides</Link>
      <div className="mx-auto mt-8 max-w-4xl"><div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold uppercase tracking-[0.12em] text-blue-700"><span>{post.category}</span><span className="h-1 w-1 rounded-full bg-slate-400" /><span className="inline-flex items-center gap-1.5 font-medium normal-case tracking-normal text-slate-500"><CalendarDays size={14} />{new Date(`${post.date}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span></div>
        <h1 className="editorial-serif mt-4 max-w-4xl text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">{post.title}</h1>
        {post.primaryCpaUrl && <div className="mt-6"><QuickPickHero post={post} /></div>}
        {post.content.trim() && (
          <details className="mt-8 border-t border-slate-200 pt-5">
            <summary className="group flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 text-base font-extrabold text-blue-900 shadow-sm transition hover:border-blue-300 hover:bg-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 marker:hidden">
                <span>Read the complete guide</span>
                <ArrowDown size={18} className="shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
            <div className="article-content prose prose-slate mt-6 max-w-none prose-headings:font-semibold prose-p:leading-7 prose-li:leading-7 prose-a:font-semibold prose-a:underline-offset-4 prose-blockquote:border-emerald-500 prose-blockquote:text-slate-600" dangerouslySetInnerHTML={{ __html: html }} />
          </details>
        )}
        <script dangerouslySetInnerHTML={{ __html: "(function(s){s.dataset.zone='11932119',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))" }} />
        {post.comparison.length > 0 && <section className="mt-10"><h2 className="editorial-serif text-3xl">Compare the options</h2><p className="mt-2 text-sm text-slate-600">Terms are subject to change. Confirm details on each provider&apos;s website.</p><ComparisonTable entries={post.comparison} /></section>}
        {post.faqs.length > 0 && <section className="mt-12 border-t border-slate-200 pt-8"><h2 className="editorial-serif text-3xl">Frequently asked questions</h2><div className="mt-5 divide-y divide-slate-200">{post.faqs.map((faq) => <details key={faq.question} className="py-4"><summary className="cursor-pointer font-semibold text-slate-900">{faq.question}</summary><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{faq.answer}</p></details>)}</div></section>}
        {post.primaryCpaUrl && <OfferCta post={post} secondary />}
        {relatedPosts.length > 0 && <section className="mt-12 border-t border-slate-200 pt-8" aria-labelledby="related-guides-title">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">Keep exploring</p>
          <h2 id="related-guides-title" className="editorial-serif mt-2 text-3xl text-slate-950">More guides you might like</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((relatedPost) => <article key={relatedPost.slug} className="border-t border-slate-200 pt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">{relatedPost.category}</p>
              <h3 className="editorial-serif mt-2 text-xl leading-tight">
                <Link href={`/blog/${relatedPost.slug}`} className="hover:text-blue-700">{relatedPost.title}</Link>
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{relatedPost.excerpt}</p>
              <Link href={`/blog/${relatedPost.slug}`} className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800">Read guide <ArrowRight size={15} /></Link>
            </article>)}
          </div>
        </section>}
        <div className="mt-10 border-t border-slate-200 pt-5 text-xs leading-5 text-slate-500">This article is for informational purposes only and is not financial, tax, or legal advice. See our <Link href="/affiliate-disclosure" className="font-semibold text-blue-700 underline">affiliate disclosure</Link>.</div>
      </div>
    </div><MobileOfferBar post={post} />
  </main>;
}