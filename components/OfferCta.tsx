import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import type { Post } from "@/lib/posts";

const categoryLabels: Record<Post["category"], string> = {
  "Reward Apps": "See current reward offers",
  "Side Hustles": "Explore this opportunity",
  "Smart Budgeting": "Compare available tools",
  "Remote Work": "View current opportunities",
};

export function OfferCta({ post, secondary = false }: { post: Post; secondary?: boolean }) {
  const label = post.quickPick?.ctaLabel?.trim() || categoryLabels[post.category];

  return (
    <aside className={`relative overflow-hidden border border-emerald-300 bg-white p-5 shadow-sm sm:p-6 ${secondary ? "mt-12" : ""}`} aria-label={secondary ? "Continue to the offer" : "Featured offer action"}>
      <div className="absolute inset-y-0 left-0 w-1.5 bg-emerald-500" aria-hidden="true" />
      <div className="pl-2 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div>
          {secondary && <h2 className="editorial-serif text-xl font-semibold text-slate-950">Review the offer details</h2>}
          <p className={`text-sm leading-6 text-slate-600 ${secondary ? "mt-1" : ""}`}>
            Check the provider&apos;s current reward, eligibility, and terms before continuing.
          </p>
        </div>
        <div className="mt-4 shrink-0 sm:mt-0">
          {post.primaryCpaUrl ? (
            <Link
              href={post.primaryCpaUrl}
              rel="sponsored nofollow noopener noreferrer"
              target="_blank"
              className="group inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-md bg-emerald-700 px-5 py-3 text-center text-sm font-extrabold text-white shadow-md shadow-emerald-900/15 transition hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 sm:w-auto"
            >
              <span className="motion-safe:animate-pulse" aria-hidden="true"><Zap size={16} fill="currentColor" /></span>
              {label}
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <span className="inline-flex min-h-14 items-center justify-center rounded-md bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-500">
              Offer link not configured
            </span>
          )}
          <p className="mt-2 flex items-center justify-center gap-1 text-center text-[11px] font-medium text-slate-600">
            <Zap size={12} className="shrink-0 text-amber-600" />
            Check eligibility; timing and availability vary.
          </p>
        </div>
      </div>
      <p className="mt-3 pl-2 text-[10px] leading-4 text-slate-500">Partner link. Review the provider&apos;s terms before signing up.</p>
    </aside>
  );
}
