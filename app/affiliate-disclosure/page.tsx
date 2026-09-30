import type { Metadata } from "next";

export const metadata: Metadata = { title: "Affiliate disclosure", description: "Learn how EarnPouch may earn cost-per-action commissions from affiliate links." };

export default function AffiliateDisclosure() {
  return <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8 lg:py-16"><p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-700">Our standards</p><h1 className="editorial-serif mt-3 text-4xl sm:text-5xl">Affiliate disclosure</h1><p className="mt-4 text-sm text-slate-500">Last updated October 1, 2026</p><div className="prose prose-slate mt-9 max-w-none prose-headings:font-semibold prose-p:leading-7 prose-li:leading-7">
    <p><strong>EarnPouch is reader-supported. We may earn an affiliate commission when you sign up through our links at no extra cost to you.</strong></p>
    <p>Some links on EarnPouch are affiliate links. If you click one and complete a qualifying action (for example, creating an account, making a purchase, or meeting an offer&apos;s requirements), the provider or its network may pay us a commission. These arrangements are commonly called cost-per-action (CPA) commissions. The action required and commission amount vary by partner and are not charged to you as a separate fee.</p>
    <h2>How this supports our work</h2><p>Commissions help fund research, editing, hosting, and the continued publication of free guides. We identify affiliate links near recommendations or through this disclosure. Partner tracking may use cookies or similar technology, subject to the partner&apos;s privacy policy and your choices.</p>
    <h2>Editorial independence</h2><p>Compensation does not guarantee a favorable review, placement, or recommendation. Our editorial team aims to assess relevance, terms, availability, and potential drawbacks. Partners do not approve our editorial conclusions. Availability and offer terms may change, so verify details directly with the provider before you sign up.</p>
    <h2>Your choice</h2><p>You are never required to use an affiliate link. You can visit a provider directly, compare alternatives, and decide whether an offer fits your needs. A link is not financial, legal, or tax advice, and it is not a guarantee that a product or service is right for you.</p>
    <h2>Questions</h2><p>For questions about a specific relationship or our editorial standards, email <a href="mailto:support@earnpouch.com">support@earnpouch.com</a>.</p>
  </div></main>;
}