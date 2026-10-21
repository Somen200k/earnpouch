import { Star } from "lucide-react";
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
    <section className="rounded-2xl border border-slate-200 border-l-4 border-l-[#00a86b] bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-700">
            Premium Selection
          </span>
          {typeof pick.rating === "number" && (
            <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-700">
              <Star size={15} fill="currentColor" /> {pick.rating.toFixed(1)}
              {pick.reviewCount ? <span className="font-medium text-slate-500">({pick.reviewCount.toLocaleString()} reviews)</span> : null}
            </span>
          )}
        </div>
        <h2 className="mb-4 mt-2 text-xl font-bold text-slate-900">{pick.name}</h2>
        <div className="flex flex-col gap-6 md:flex-row">
          <ul className="min-w-0 flex-1 space-y-3">
            {pick.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm leading-6 text-slate-700">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-200 ring-2 ring-emerald-100" aria-hidden="true" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <div className="min-w-0 md:w-[42%]">
            <OfferCta post={post} compact />
          </div>
        </div>
      </section>
  );
}

export function QuickPickDetails({ post }: { post: Post }) {
  const pick = post.quickPick;
  if (!pick) return null;

  return (
    <>
      <div className="my-8 grid grid-cols-2 gap-2 rounded-xl border-y border-slate-100 bg-slate-50/40 py-4 text-center md:grid-cols-3">
        {[
          { label: "Bonus Type", value: pick.bonus },
          { label: "Cashout Rule", value: pick.cashoutMin },
          { label: "Payout Route", value: pick.payoutMethod },
        ].map(({ label, value }) => (
          <div key={label} className="min-w-0 px-2 py-1 last:col-span-2 md:last:col-span-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-600">{label}</p>
            <p className="mt-1 text-xs font-semibold leading-5 text-slate-800">{value}</p>
          </div>
        ))}
      </div>

      {(post.coverImage || pick.steps?.length) && (
        <div className="grid gap-6 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:items-center">
          {post.coverImage && (
            <div>
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-slate-100">
                <Image src={post.coverImage} alt="" fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
              </div>
              {post.coverImage.includes("images.unsplash.com") && (
                <p className="mt-1.5 text-xs text-slate-500">Illustrative stock photo; not the promotion or prize.</p>
              )}
            </div>
          )}
          {pick.steps?.length ? (
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-800">Three quick checks</h3>
              <ol className="mt-3 space-y-2.5">
                {pick.steps.slice(0, 3).map((step, index) => (
                  <li key={step} className="flex items-start gap-2.5 text-sm leading-5 text-slate-700">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-extrabold text-emerald-900">{index + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}