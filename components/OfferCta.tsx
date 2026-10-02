import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/lib/posts";

export function OfferCta({ post, secondary = false }: { post: Post; secondary?: boolean }) {
  const label = post.quickPick?.ctaLabel?.trim() || "Check offer availability";

  return (
    <aside className={`relative overflow-hidden rounded-xl border border-emerald-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.07)] sm:p-6 ${secondary ? "mt-12" : ""}`} aria-label={secondary ? "Continue to the offer" : "Featured offer action"}>
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-emerald-400 to-sky-500" aria-hidden="true" />
      <div className="pl-2 sm:flex sm:items-center sm:justify-between sm:gap-8">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-emerald-800">
            {secondary ? "Ready to take a look?" : "Your next step"}
          </p>
          <h3 className="editorial-serif mt-1 text-xl font-semibold leading-tight text-slate-950 sm:text-2xl">
            {secondary ? "Check the current offer details" : "See if this offer is available to you"}
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
            Review the provider&apos;s requirements, eligibility, and payout details before deciding whether to continue.
          </p>
        </div>
        <div className="mt-5 shrink-0 sm:mt-0">
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
        </div>
      </div>
      <p className="mt-4 border-t border-slate-100 pt-3 pl-2 text-[11px] leading-5 text-slate-500">
        Partner link. EarnPouch may earn a commission if you complete a qualifying offer, at no extra cost to you.
      </p>
    </aside>
  );
}
