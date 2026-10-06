"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { categories, categoryPath } from "@/lib/category-url";

const defaultSettings = {
  siteName: "EarnPouch",
  navLinks: [...categories],
};

export function Header() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/site-settings")
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (!data) return;
        setSettings({
          siteName: typeof data.siteName === "string" ? data.siteName : defaultSettings.siteName,
          navLinks: Array.isArray(data.navLinks) ? data.navLinks.filter((value: unknown): value is string => typeof value === "string") : defaultSettings.navLinks,
        });
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);
  if (pathname.startsWith("/admin")) return null;
  return <><header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur"><div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
    <Link href="/" className="flex items-center gap-2 text-[21px] font-extrabold tracking-[-0.04em] text-slate-950" aria-label="EarnPouch home">{settings.siteName}<span className="-ml-1 mb-[-10px] h-2.5 w-2.5 rounded-full bg-emerald-500" /></Link>
    <nav className="hidden items-center gap-1.5 lg:flex xl:gap-2" aria-label="Main navigation">{settings.navLinks.map((label) => {
      const href = categoryPath(label);
      const active = pathname === href || pathname.startsWith(`${href}/`);
      return <Link key={label} href={href} aria-current={active ? "page" : undefined} className={`whitespace-nowrap rounded-full border px-3 py-2 text-[11px] font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 xl:px-3.5 xl:text-xs ${active ? "border-emerald-700 bg-emerald-700 text-white shadow-sm shadow-emerald-900/15" : "border-emerald-200 bg-emerald-50/60 text-emerald-950 shadow-sm hover:border-emerald-400 hover:bg-emerald-100"}`}>{label}</Link>;
    })}</nav>
    <div className="hidden lg:block"><Link href="/blog" className="rounded-md bg-green-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-green-700">Explore guides</Link></div>
    <button type="button" aria-label={open ? "Close navigation menu" : "Open navigation menu"} aria-expanded={open} onClick={() => setOpen(!open)} className="inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-800 hover:bg-slate-100 lg:hidden">{open ? <X size={22} /> : <Menu size={22} />}</button>
  </div></header>{open && <div className="fixed inset-x-0 bottom-0 top-[72px] z-50 overflow-y-auto border-t border-slate-200 bg-white px-5 pb-8 pt-5 lg:hidden"><nav aria-label="Mobile navigation" className="mx-auto flex max-w-xl flex-col">{settings.navLinks.map((label, index) => {
    const href = categoryPath(label);
    const active = pathname === href || pathname.startsWith(`${href}/`);
    return <Link key={label} onClick={() => setOpen(false)} href={href} aria-current={active ? "page" : undefined} className={`flex items-center justify-between border-b py-5 text-lg font-semibold transition ${active ? "border-emerald-100 text-emerald-800" : "border-slate-100 text-slate-900 hover:text-emerald-800"}`}><span>{label}</span><span className={`text-xs font-bold tracking-widest ${active ? "text-emerald-700" : "text-slate-400"}`}>0{index + 1}</span></Link>;
  })}<Link onClick={() => setOpen(false)} href="/blog" className="mt-6 flex min-h-12 items-center justify-center rounded-md bg-green-600 px-4 text-sm font-bold text-white hover:bg-green-700">Explore all guides</Link><div className="mt-8 grid grid-cols-2 gap-4 text-sm text-slate-500"><Link onClick={() => setOpen(false)} href="/contact">Contact</Link><Link onClick={() => setOpen(false)} href="/affiliate-disclosure">Affiliate disclosure</Link></div></nav></div>}</>;
}