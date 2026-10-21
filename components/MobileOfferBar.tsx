"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCtaButtonLabel } from "@/lib/cta-label";
import type { Post } from "@/lib/posts";

export function MobileOfferBar({ post }: { post: Post }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setVisible(window.matchMedia("(max-width: 767px)").matches && window.scrollY > 500);
    };

    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);
    updateVisibility();
    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  if (!post.primaryCpaUrl) return null;

  const searchContext = [
    post.quickPick?.name,
    post.quickPick?.ctaLabel,
    post.quickPick?.mobileCtaNotice,
  ].filter(Boolean).join(" ");
  const isJobSearchOffer = /job|opening|listing/i.test(searchContext);
  const title = isJobSearchOffer
    ? "Verify Local Listings"
    : post.quickPick?.nextStepTitle?.trim() || post.quickPick?.name || "Review this offer";
  const subtitle = isJobSearchOffer ? "Find active open shifts" : "Review the current offer details";
  const label = getCtaButtonLabel(post);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed bottom-0 left-0 right-0 z-30 block border-t border-slate-200/80 bg-white p-4 shadow-[0_-8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 ease-out md:hidden ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none invisible translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold leading-5 text-slate-900">{title}</p>
          <p className="truncate text-xs leading-4 text-slate-600">{subtitle}</p>
          <p className="text-[10px] leading-4 text-slate-500">
            Affiliate link · <Link href="/affiliate-disclosure" tabIndex={visible ? 0 : -1} className="underline">disclosure</Link>
          </p>
        </div>
        <Link
          href={post.primaryCpaUrl}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          tabIndex={visible ? 0 : -1}
          className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full bg-[#00a86b] px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#008f5a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008f5a] motion-reduce:transition-none"
        >
          {label} ➔
        </Link>
      </div>
    </div>
  );
}