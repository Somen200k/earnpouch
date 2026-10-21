import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getCtaButtonLabel } from "@/lib/cta-label";
import type { Post } from "@/lib/posts";

export function OfferCta({ post, secondary = false, compact = false }: { post: Post; secondary?: boolean; compact?: boolean }) {
  const label = getCtaButtonLabel(post);

  if (compact) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4" aria-label="Featured affiliate offer action">
        {post.primaryCpaUrl ? (
          <Link
            id="primary-offer-cta"
            href={post.primaryCpaUrl}
            rel="sponsored nofollow noopener noreferrer"
            target="_blank"
            className="group inline-flex min-h-16 w-full shrink-0 items-center justify-center gap-3 rounded-2xl border border-white/20 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 px-5 py-3 text-center text-[15px] font-extrabold leading-snug text-white shadow-[0_10px_24px_rgba(5,150,105,0.25)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:from-emerald-700 hover:via-emerald-800 hover:to-teal-800 hover:shadow-[0_14px_30px_rgba(5,150,105,0.32)] active:translate-y-0 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 focus-visible:ring-4 focus-visible:ring-emerald-500/25 motion-reduce:transform-none motion-reduce:transition-none"
          >
            {label}
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 transition-colors group-hover:bg-white/25">
              <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </Link>
        ) : (
          <span className="inline-flex min-h-12 items-center justify-center rounded-lg bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-500">
            Offer link not configured
          </span>
        )}
        <div className="text-center text-[11px] leading-4 text-slate-500">
          Independent listings • Affiliate link <Link href="/affiliate-disclosure" className="font-semibold underline underline-offset-2 hover:text-slate-700">disclosure</Link>
        </div>
      </div>
    );
  }

  return (
    <aside className={`relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-white via-white to-emerald-50/70 p-5 shadow-[0_12px_32px_rgba(15,23,42,0.08)] sm:p-7 ${secondary ? "mt-12" : ""}`} aria-label={secondary ? "Continue to the offer" : "Featured offer action"}>
      <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-emerald-400 to-teal-600" aria-hidden="true" />
      <div className="grid gap-5 pl-2 sm:grid-cols-[minmax(0,1fr)_minmax(14rem,auto)] sm:items-center sm:gap-8">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-emerald-800">
            {secondary ? "Ready to take a look?" : "Your next step"}
          </p>
          <h3 className="editorial-serif mt-1 text-xl font-semibold leading-tight text-slate-950 sm:text-2xl">
            {post.quickPick?.nextStepTitle?.trim()
              || (secondary ? "Check the current offer details" : "See if this offer is available to you")}
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
            {post.quickPick?.nextStepDescription?.trim()
              || "Continue to the provider's offer page to review the current requirements and complete the listed action if you choose."}
          </p>
          <p className="mt-3 text-[11px] leading-4 text-slate-500">
            Affiliate link · <Link href="/affiliate-disclosure" className="underline underline-offset-2 hover:text-slate-600">disclosure</Link>
          </p>
        </div>
        <div className="flex flex-col items-stretch sm:items-end">
          {post.primaryCpaUrl ? (
            <Link
              id={secondary ? "secondary-offer-cta" : "primary-offer-cta"}
              href={post.primaryCpaUrl}
              rel="sponsored nofollow noopener noreferrer"
              target="_blank"
              className="group inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl border border-white/20 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 px-7 py-3 text-center text-[15px] font-extrabold leading-snug text-white shadow-[0_10px_24px_rgba(5,150,105,0.25)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:from-emerald-700 hover:via-emerald-800 hover:to-teal-800 hover:shadow-[0_14px_30px_rgba(5,150,105,0.32)] active:translate-y-0 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 focus-visible:ring-4 focus-visible:ring-emerald-500/25 motion-reduce:transform-none motion-reduce:transition-none sm:min-w-60 sm:w-auto"
            >
              {label}
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 transition-colors group-hover:bg-white/25">
                <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          ) : (
            <span className="inline-flex min-h-14 items-center justify-center rounded-lg bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-500">
              Offer link not configured
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
