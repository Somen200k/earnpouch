import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories, categoryPath } from "@/lib/category-url";

export const metadata: Metadata = {
  title: "About EarnPouch",
  description: "Learn what EarnPouch covers, how the site is supported, and how to explore our practical money guides.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
      <header className="border-b border-slate-200 pb-8 sm:pb-10">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#008f5a]">About EarnPouch</p>
        <h1 className="editorial-serif mt-3 max-w-3xl text-4xl leading-tight text-slate-950 sm:text-5xl">
          Practical guides for everyday money decisions.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
          EarnPouch publishes guides about earning, rewards, work, and budgeting. Our goal is to help readers understand
          the details, compare options, and decide what to explore next.
        </p>
      </header>

      <section className="grid gap-8 py-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-start md:gap-12">
        <aside className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#008f5a]">What you&apos;ll find here</p>
          <ul className="mt-5 space-y-4">
            <li className="border-b border-emerald-100 pb-4">
              <h2 className="font-semibold text-slate-900">Practical guides</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">Clear introductions to earning, rewards, work, and budgeting topics.</p>
            </li>
            <li className="border-b border-emerald-100 pb-4">
              <h2 className="font-semibold text-slate-900">Details worth checking</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">Eligibility, requirements, and terms to review with the provider.</p>
            </li>
            <li>
              <h2 className="font-semibold text-slate-900">Independent choices</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">No offer is guaranteed, and you can always decide not to continue.</p>
            </li>
          </ul>
        </aside>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#008f5a]">How we approach our guides</p>
          <h2 className="editorial-serif mt-2 text-3xl leading-tight text-slate-950">Clarity before a click</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            We explain what an offer or resource says it provides, highlight details readers should verify, and link to
            the relevant provider when readers want to review current terms. Offers can change, and the provider&apos;s
            active terms control.
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Some links are affiliate links. If you choose to complete an eligible action, EarnPouch may receive a
            commission at no extra cost to you. Compensation does not make an offer guaranteed or establish endorsement
            by a brand mentioned in a guide.
          </p>
          <Link href="/editorial-standards" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#008f5a] hover:text-emerald-900">
            Read our editorial standards <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="border-t border-slate-200 pt-8" aria-labelledby="about-topics">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#008f5a]">Explore the library</p>
        <h2 id="about-topics" className="editorial-serif mt-2 text-3xl text-slate-950">Browse by topic</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link key={category} href={categoryPath(category)} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-[#008f5a]">
              {category}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
