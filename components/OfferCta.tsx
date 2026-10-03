import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/lib/posts";

export function OfferCta({ post, secondary = false }: { post: Post; secondary?: boolean }) {
  const label = post.quickPick?.ctaLabel?.trim() || "Continue to offer";
  const notice = post.quickPick?.disclaimer?.trim()
    || "Independent third-party promotion. Not an official offer from or endorsement by the brand shown. Review eligibility, entry steps, and official rules on the offer page before continuing.";

  return (
    <aside className={`relative overflow-hidden rounded-xl border border-emerald-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.07)] sm:p-6 ${secondary ? "mt-12" : ""}`} aria-label={secondary ? "Continue to the offer" : "Featured offer action"}>
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-emerald-400 to-sky-500" aria-hidden="true" />
      <div className="grid gap-5 pl-2 sm:grid-cols-[minmax(0,1fr)_minmax(14rem,auto)] sm:items-start sm:gap-8">
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
        </div>
        <div className="flex flex-col items-stretch sm:items-end">
          {post.primaryCpaUrl ? (
            <Link
              href={post.primaryCpaUrl}
              rel="sponsored nofollow noopener noreferrer"
              target="_blank"
              className="group inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-6 py-3 text-center text-sm font-extrabold text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 sm:min-w-56 sm:w-auto"
            >
              {label}
              <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          ) : (
            <span className="inline-flex min-h-14 items-center justify-center rounded-lg bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-500">
              Offer link not configured
            </span>
          )}
          <p className="mt-2 max-w-xl text-right text-xs leading-5 text-slate-500 sm:max-w-sm">{notice}</p>
        </div>
      </div>
    </aside>
  );
}
