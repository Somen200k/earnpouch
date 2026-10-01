import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/lib/posts";

const mobileLabels: Record<Post["category"], string> = {
  "Reward Apps": "See rewards",
  "Side Hustles": "Explore work",
  "Smart Budgeting": "Compare tools",
  "Remote Work": "View jobs",
};

export function MobileOfferBar({ post }: { post: Post }) {
  if (!post.primaryCpaUrl) return null;
  const title = post.quickPick?.name ?? post.title;
  return <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur md:hidden"><div className="mx-auto flex max-w-lg items-center gap-3"><p className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-900">{title}</p><Link href={post.primaryCpaUrl} target="_blank" rel="sponsored nofollow noopener noreferrer" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-bold text-white hover:bg-emerald-800">{mobileLabels[post.category]} <ArrowUpRight size={15} /></Link></div></div>;
}