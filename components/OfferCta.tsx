import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/lib/posts";

export function OfferCta({ post, secondary = false, compact = false }: { post: Post; secondary?: boolean; compact?: boolean }) {
  const label = post.quickPick?.ctaLabel?.trim() || "Continue to offer";
  const notice = post.quickPick?.disclaimer?.trim()
    || "Review the provider's current eligibility and requirements before continuing.";

  if (compact) {
    return (
      <div className="mt-5 border-t border-emerald-200/80 pt-4 sm:flex sm:items-center sm:justify-between sm:gap-6" aria-label="Featured offer action">
        <div className="mb-3 min-w-0 sm:mb-0">
          <p className="text-xs leading-5 text-slate-600">{notice}</p>
          <p className="mt-1 text-[10px] leading-4 text-slate-400">
            Affiliate link · <Link href="/affiliate-disclosure" className="underline underline-offset-2 hover:text-slate-600">disclosure</Link>
          </p>
        </div>
        {post.primaryCpaUrl ? (
          <Link
            id="primary-offer-cta"
            href={post.primaryCpaUrl}
            rel="sponsored nofollow noopener noreferrer"
            target="_blank"
            className="group inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 px-6 py-3 text-center text-sm font-extrabold text-white shadow-md shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:from-emerald-800 hover:to-teal-800 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 sm:w-auto sm:min-w-52"
          >
            {label}
            <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        ) : (
          <span className="inline-flex min-h-12 items-center justify-center rounded-lg bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-500">
            Offer link not configured
          </span>
        )}
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
          <p className="mt-3 max-w-xl text-xs leading-5 text-slate-500">{notice}</p>
          <p className="mt-1 text-[10px] leading-4 text-slate-400">
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
              className="group inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 px-7 py-3 text-center text-sm font-extrabold text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:from-emerald-800 hover:to-teal-800 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 sm:min-w-60 sm:w-auto"
            >
              {label}
              <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
