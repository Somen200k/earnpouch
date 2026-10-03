import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/lib/posts";

export function MobileOfferBar({ post }: { post: Post }) {
  if (!post.primaryCpaUrl) return null;
  const title = post.quickPick?.name ?? "View the provider's offer details";
  const label = post.quickPick?.ctaLabel?.trim() || "Continue";
  const isNikePost = post.slug === "nike-gift-card-giveaway-how-to-enter-2026";
  const notice = isNikePost
    ? "Independent promotion. Not sponsored by or affiliated with Nike. Review eligibility and entry details on the offer page; entry does not guarantee a prize."
    : post.quickPick?.mobileCtaNotice ?? "Third-party offer • Review steps and terms • Reward not guaranteed";

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-emerald-200 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-10px_30px_rgba(15,23,42,0.12)] backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-lg flex-col gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{title}</p>
          {!isNikePost && notice && <p className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-amber-900">{notice}</p>}
        </div>
        <Link
          href={post.primaryCpaUrl}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          className="inline-flex min-h-12 w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-700 px-4 text-sm font-extrabold text-white shadow-md shadow-emerald-900/15 transition hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          {label}
          <ArrowUpRight size={16} />
        </Link>
        {isNikePost && <p className="text-center text-[10px] leading-4 text-slate-500">{notice}</p>}
      </div>
    </div>
  );
}