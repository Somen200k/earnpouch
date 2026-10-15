import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import { ArticleShare } from "@/components/ArticleShare";
import { ComparisonTable } from "@/components/ComparisonTable";
import { MobileOfferBar } from "@/components/MobileOfferBar";
import { OfferCta } from "@/components/OfferCta";
import { QuickPickHero } from "@/components/QuickPickHero";
import { categoryPath } from "@/lib/category-url";
import { getPost, listPosts } from "@/lib/posts";
import { renderMarkdown } from "@/lib/render-markdown";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return listPosts().map(({ slug }) => ({ slug })); }

function withoutMarkdownFaq(markdown: string): string {
  const lines = markdown.split(/\r?\n/);
  const faqStart = lines.findIndex((line) => /^##\s+frequently asked questions\s*$/i.test(line.trim()));
  if (faqStart < 0) return markdown;
  const nextSection = lines.findIndex((line, index) => index > faqStart && /^##\s+/.test(line.trim()));
  return [...lines.slice(0, faqStart), ...lines.slice(nextSection < 0 ? lines.length : nextSection)].join("\n");
}

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
    .filter(({ relevance }) => relevance >= 2)
    .sort((first, second) => second.relevance - first.relevance || second.post.date.localeCompare(first.post.date))
    .slice(0, 3)
    .map(({ post: relatedPost }) => relatedPost);
  const html = await renderMarkdown(withoutMarkdownFaq(post.content));
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
      <div className="mx-auto mt-8 max-w-4xl"><div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold uppercase tracking-[0.12em] text-blue-700"><Link href={categoryPath(post.category)} className="hover:underline">{post.category}</Link><span className="h-1 w-1 rounded-full bg-slate-400" /><span className="inline-flex items-center gap-1.5 font-medium normal-case tracking-normal text-slate-500"><CalendarDays size={14} />{new Date(`${post.date}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span></div>
        <h1 className="editorial-serif mt-4 max-w-4xl text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">{post.title}</h1>
        <ArticleShare title={post.title} url={`https://www.earnpouch.com/blog/${post.slug}`} />
        {post.primaryCpaUrl && <div className="mt-6"><QuickPickHero post={post} /></div>}
        {post.content.trim() && (
          <article className="article-content prose prose-slate mx-auto mt-9 max-w-none rounded-2xl border border-slate-200 bg-white px-6 py-7 shadow-[0_12px_36px_rgba(15,23,42,0.05)] first:prose-p:text-lg first:prose-p:leading-8 first:prose-p:text-slate-700 prose-headings:font-semibold prose-p:leading-8 prose-li:leading-7 prose-a:font-semibold prose-a:underline-offset-4 prose-h2:mt-12 prose-h2:border-l-4 prose-h2:border-emerald-500 prose-h2:pl-4 prose-h2:leading-tight prose-h3:mt-8 prose-blockquote:rounded-r-lg prose-blockquote:bg-emerald-50/70 prose-blockquote:px-5 prose-blockquote:py-2 prose-blockquote:border-emerald-500 prose-blockquote:text-slate-600 prose-img:rounded-xl [&_p]:max-w-[72ch] [&_ul]:max-w-[72ch] [&_ol]:max-w-[72ch] sm:px-10 sm:py-10 lg:px-12 lg:py-12" dangerouslySetInnerHTML={{ __html: html }} />
        )}
        <script dangerouslySetInnerHTML={{ __html: "(function(s){s.dataset.zone='11932119',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))" }} />
        {post.comparison.length > 0 && <section className="mt-10"><h2 className="editorial-serif text-3xl">Compare the options</h2><p className="mt-2 text-sm text-slate-600">Terms are subject to change. Confirm details on each provider&apos;s website.</p><ComparisonTable entries={post.comparison} /></section>}
        {post.faqs.length > 0 && <section className="mt-12 border-t border-slate-200 pt-8"><h2 className="editorial-serif text-3xl">Frequently asked questions</h2><div className="mt-5 divide-y divide-slate-200">{post.faqs.map((faq) => <details key={faq.question} className="py-4"><summary className="cursor-pointer font-semibold text-slate-900">{faq.question}</summary><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{faq.answer}</p></details>)}</div></section>}
        {post.primaryCpaUrl && <OfferCta post={post} secondary />}
        {relatedPosts.length > 0 && <section className="mt-12 border-t border-slate-200 pt-8" aria-labelledby="related-guides-title">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">Keep exploring</p>
          <h2 id="related-guides-title" className="editorial-serif mt-2 text-3xl text-slate-950">More guides you might like</h2>
          <div className="mt-6 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((relatedPost) => <article key={relatedPost.slug} className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100">
              <p className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-800">{relatedPost.category}</p>
              <h3 className="editorial-serif mt-4 text-xl leading-tight text-slate-950">
                <Link href={`/blog/${relatedPost.slug}`} className="rounded-sm transition-colors group-hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">{relatedPost.title}</Link>
              </h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{relatedPost.excerpt}</p>
              <Link href={`/blog/${relatedPost.slug}`} className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-bold text-blue-700 transition-colors hover:text-blue-800">
                Read guide <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </article>)}
          </div>
        </section>}
        <div className="mt-10 border-t border-slate-200 pt-5 text-xs leading-5 text-slate-500">This article is for informational purposes only and is not financial, tax, or legal advice. See our <Link href="/affiliate-disclosure" className="font-semibold text-blue-700 underline">affiliate disclosure</Link>.</div>
      </div>
    </div><MobileOfferBar post={post} />
  </main>;
}