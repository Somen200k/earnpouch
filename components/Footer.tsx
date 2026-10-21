import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const legalLinks = [
  ["Privacy policy", "/privacy-policy"], 
  ["Terms of service", "/terms-of-service"], 
  ["Affiliate disclosure", "/affiliate-disclosure"], 
  ["Contact", "/contact"]
];

export function Footer() {
  // Hardcoding these values is significantly faster than a client-side fetch
  const siteName = "EarnPouch";
  const footerText = "Good information for earning, saving, and making the most of your money.";
  const affiliateNotice = "EarnPouch is reader-supported. We may earn an affiliate commission when you sign up through our links at no extra cost to you.";

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="grid gap-10 sm:grid-cols-[1.2fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-xl font-extrabold tracking-[-0.04em] text-white">
              {siteName}
              <span className="-ml-1 mb-[-9px] h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">{footerText}</p>
            <p className="mt-5 max-w-xl border-l-2 border-emerald-500 pl-4 text-xs leading-5 text-slate-400">{affiliateNotice}</p>
          </div>
          
          <div className="sm:justify-self-end">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Explore {siteName}</p>
            <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-3">
              {legalLinks.map(([label, href]) => (
                <Link href={href} key={href} className="inline-flex items-center gap-1 text-sm hover:text-white">
                  {label}
                  <ArrowUpRight size={13} />
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-slate-800 pt-5 text-xs text-slate-500 sm:flex-row">
          <span>© {new Date().getFullYear()} {siteName}. All rights reserved.</span>
          <span>Independent guides for everyday money choices.</span>
        </div>
      </div>
    </footer>
  );
}