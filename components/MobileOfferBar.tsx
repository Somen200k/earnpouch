import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function MobileOfferBar({ title, href }: { title: string; href?: string }) {
  if (!href) return null;
  return <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur md:hidden"><div className="mx-auto flex max-w-lg items-center gap-3"><div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Top pick</p><p className="truncate text-sm font-semibold text-slate-900">{title}</p></div><Link href={href} target="_blank" rel="sponsored nofollow noopener noreferrer" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md bg-green-600 px-4 text-sm font-bold text-white hover:bg-green-700">View offer <ArrowUpRight size={15} /></Link></div></div>;
}