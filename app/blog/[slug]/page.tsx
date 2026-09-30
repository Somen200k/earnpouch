import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { ComparisonTable } from "@/components/ComparisonTable";
import { MobileOfferBar } from "@/components/MobileOfferBar";
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
  const html = await renderMarkdown(post.content);
  const schemas = [
    { "@context": "https://schema.org", "@type": "Review", name: post.title, reviewBody: post.excerpt, datePublished: post.date, author: { "@type": "Organization", name: "EarnPouch Editorial Team" }, itemReviewed: { "@type": "Product", name: post.quickPick?.name ?? post.title }, ...(typeof post.quickPick?.rating === "number" ? { reviewRating: { "@type": "Rating", ratingValue: post.quickPick.rating, bestRating: 5, worstRating: 1 } } : {}), url: `https://www.earnpouch.com/blog/${post.slug}` },
    ...(post.faqs.length ? [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: post.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }] : []),
  ];

  return <main className="pb-24 md:pb-0">{schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />)}
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12"><Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-700"><ArrowLeft size={15} /> All guides</Link>
      <div className="mx-auto mt-8 max-w-4xl"><div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold uppercase tracking-[0.12em] text-blue-700"><span>{post.category}</span><span className="h-1 w-1 rounded-full bg-slate-400" /><span className="inline-flex items-center gap-1.5 font-medium normal-case tracking-normal text-slate-500"><CalendarDays size={14} />{new Date(`${post.date}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span></div>
        <h1 className="editorial-serif mt-4 max-w-4xl text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">{post.title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{post.excerpt}</p>{post.coverImage && <Image src={post.coverImage} alt="" width={1600} height={900} priority className="mt-8 max-h-[480px] w-full bg-slate-100 object-cover" />}
        <p className="mt-4 text-xs text-slate-500">EarnPouch may earn a commission from some links in this article. Our recommendations are selected by our editorial team.</p><div className="mt-8"><QuickPickHero post={post} /></div>
        <div className="article-content prose prose-slate mt-10 max-w-none prose-headings:font-semibold prose-p:leading-7 prose-li:leading-7 prose-a:font-semibold prose-a:underline-offset-4 prose-blockquote:border-emerald-500 prose-blockquote:text-slate-600" dangerouslySetInnerHTML={{ __html: html }} />
        {post.comparison.length > 0 && <section className="mt-10"><h2 className="editorial-serif text-3xl">Compare the options</h2><p className="mt-2 text-sm text-slate-600">Terms are subject to change. Confirm details on each provider&apos;s website.</p><ComparisonTable entries={post.comparison} /></section>}
        {post.faqs.length > 0 && <section className="mt-12 border-t border-slate-200 pt-8"><h2 className="editorial-serif text-3xl">Frequently asked questions</h2><div className="mt-5 divide-y divide-slate-200">{post.faqs.map((faq) => <details key={faq.question} className="py-4"><summary className="cursor-pointer font-semibold text-slate-900">{faq.question}</summary><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{faq.answer}</p></details>)}</div></section>}
        <div className="mt-10 border-t border-slate-200 pt-5 text-xs leading-5 text-slate-500">This article is for informational purposes only and is not financial, tax, or legal advice. See our <Link href="/affiliate-disclosure" className="font-semibold text-blue-700 underline">affiliate disclosure</Link>.</div>
      </div>
    </div><MobileOfferBar title={post.quickPick?.name ?? post.title} href={post.primaryCpaUrl} />
  </main>;
}