import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Editorial standards",
  description: "How EarnPouch presents third-party offers, affiliate links, updates, and reader corrections.",
};

export default function EditorialStandardsPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
      <header className="mb-8 border-b border-slate-200 pb-8">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#008f5a]">Our approach</p>
        <h1 className="editorial-serif mt-3 text-4xl sm:text-5xl">Editorial standards</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          These standards describe how EarnPouch aims to make practical guides clear, useful, and transparent.
        </p>
      </header>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-p:leading-7 prose-li:leading-7">
          <h2>Be clear about third-party offers</h2>
          <p>
            A guide may discuss a promotion, product, employer, or service operated by another organization. We aim to
            distinguish information supplied by a listing from details confirmed in the provider&apos;s active rules.
            Brand names or logos alone do not establish sponsorship or endorsement.
          </p>
          <h2>Explain what readers should verify</h2>
          <p>
            Availability, eligibility, entry steps, payout terms, and privacy practices can change. Readers should
            review the current provider terms before sharing information or taking action. A listed reward or opportunity
            is not a guarantee of acceptance, earnings, or receiving a prize.
          </p>
          <h2>Make affiliate relationships visible</h2>
          <p>
            EarnPouch may earn a commission when a reader follows an affiliate link and completes a qualifying action.
            This does not add a separate fee for the reader. Affiliate relationships do not guarantee that an offer is
            available or suitable for a particular person.
          </p>
          <h2>Update and correct content</h2>
          <p>
            We may update guides when material details change or readers point out an error. If you notice information
            that appears inaccurate or out of date, contact us with the article link and the detail to review.
          </p>
          <h2>Content is informational</h2>
          <p>
            EarnPouch guides provide general information, not individualized financial, legal, tax, or employment advice.
            Verify important details with the relevant provider or a qualified professional.
          </p>
        </div>
        <Link href="/contact" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#008f5a] hover:text-emerald-900">
          Send an editorial correction <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  );
}
