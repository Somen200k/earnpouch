import { Check, Star } from "lucide-react";
import Image from "next/image";
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
          Offer snapshot
        </span>
        {typeof pick.rating === "number" && (
          <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-700">
            <Star size={15} fill="currentColor" /> {pick.rating.toFixed(1)}
            {pick.reviewCount ? <span className="font-medium text-slate-500">({pick.reviewCount.toLocaleString()} reviews)</span> : null}
          </span>
        )}
      </div>
      <h2 className="editorial-serif mt-4 text-2xl leading-tight text-slate-950 sm:text-3xl">{pick.name}</h2>
      <p className="mt-2 inline-flex max-w-fit items-center rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-bold text-emerald-900">
        {pick.bonus}
      </p>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
        {post.excerpt}
      </p>
      <div className="mt-5 grid gap-5 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-center">
        {post.coverImage && (
          <div>
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              <Image src={post.coverImage} alt="" fill priority sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
            </div>
            {post.coverImage.includes("images.unsplash.com") && (
              <p className="mt-1.5 text-xs text-slate-500">Illustrative stock photo; not the promotion or prize.</p>
            )}
          </div>
        )}
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-800">Three quick checks</h3>
          {pick.steps?.length ? (
            <ol className="mt-3 space-y-2.5">
              {pick.steps.slice(0, 3).map((step, index) => (
                <li key={step} className="flex items-start gap-2.5 text-sm leading-5 text-slate-700">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-extrabold text-emerald-900">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          ) : (
            <ul className="mt-3 space-y-2.5">
              {pick.features.slice(0, 3).map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm leading-5 text-slate-700">
                  <Check size={17} className="mt-0.5 shrink-0 text-emerald-700" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <OfferCta post={post} compact />
    </section>
  );
}