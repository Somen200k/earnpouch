import Link from "next/link";
import { getCtaButtonLabel } from "@/lib/cta-label";
import type { Post } from "@/lib/posts";

export function InTextRecommendation({ post }: { post: Post }) {
  const buttonLabel = getCtaButtonLabel(post);

  return (
    <aside className="not-prose my-6 rounded-xl border border-slate-100 border-l-4 border-l-[#00a86b] bg-slate-50/80 p-4 md:my-8 md:p-5" aria-label="Recommended resource">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-900 md:text-sm">Recommended Resource <span aria-hidden="true">➔</span></p>
          <p className="mt-1 text-xs leading-5 text-slate-600 md:text-sm">
            {post.quickPick?.name || post.title}
          </p>
          <p className="mt-1 text-[10px] leading-4 text-slate-500">
            Affiliate link · <Link href="/affiliate-disclosure" className="underline underline-offset-2">disclosure</Link>
          </p>
        </div>
        {post.primaryCpaUrl ? (
          <Link
            href={post.primaryCpaUrl}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#00a86b] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-transform hover:scale-[1.02] hover:bg-[#008f5a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008f5a] motion-reduce:transform-none motion-reduce:transition-none"
          >
            {buttonLabel} <span aria-hidden="true">➔</span>
          </Link>
        ) : (
          <span className="text-xs font-semibold text-slate-600">Offer link not configured</span>
        )}
      </div>
    </aside>
  );
}
