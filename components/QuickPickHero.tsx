import { Check, Star } from "lucide-react";
import type { Post, QuickPick } from "@/lib/posts";
import { OfferCta } from "@/components/OfferCta";

export function QuickPickHero({ post }: { post: Post }) {
  const pick: QuickPick = post.quickPick ?? {
    name: post.title,
    bonus: "See current offer",
    cashoutMin: "Varies",
    payoutMethod: "Check provider terms",
    features: [
      "Check whether the offer is available in your country",
      "Review the required steps before you begin",
      "Confirm payout details directly with the provider",
    ],
  };

  return (
    <section className="relative isolate overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-5 shadow-sm sm:p-8">
      <div className="pointer-events-none absolute -right-12 -top-16 -z-10 h-48 w-48 rounded-full bg-emerald-100/70 blur-3xl" aria-hidden="true" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-emerald-900">
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
          Featured offer
        </span>
        {typeof pick.rating === "number" && (
          <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-700">
            <Star size={15} fill="currentColor" /> {pick.rating.toFixed(1)}
            {pick.reviewCount ? <span className="font-medium text-slate-500">({pick.reviewCount.toLocaleString()} reviews)</span> : null}
          </span>
        )}
      </div>
      <h2 className="editorial-serif mt-4 text-2xl leading-tight text-slate-950 sm:text-3xl">{pick.name}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
        Curious what is available? Explore the provider&apos;s current opportunity and see the next steps.
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-3">
        {pick.features.slice(0, 3).map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 rounded-xl border border-white/90 bg-white/80 p-3 text-sm leading-5 text-slate-700 shadow-sm">
            <Check size={16} className="mt-0.5 shrink-0 text-emerald-700" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5">
        <OfferCta post={post} />
      </div>
    </section>
  );
}