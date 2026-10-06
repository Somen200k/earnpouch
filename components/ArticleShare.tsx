"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";

type ArticleShareProps = { title: string; url: string };

export function ArticleShare({ title, url }: ArticleShareProps) {
  const [status, setStatus] = useState("");

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setStatus("Link copied.");
    } catch {
      setStatus("Could not copy the link. You can copy it from your browser address bar.");
    }
  }

  async function share() {
    if (!navigator.share) {
      await copyLink();
      return;
    }

    try {
      await navigator.share({ title, url });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setStatus("Sharing is unavailable right now. Try copying the link instead.");
    }
  }

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2" aria-label="Share this article">
      <button
        type="button"
        onClick={share}
        className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
      >
        <Share2 size={15} aria-hidden="true" />
        Share article
      </button>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
      >
        {status === "Link copied." ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
        Copy link
      </button>
      <span className="sr-only" role="status" aria-live="polite">{status}</span>
    </div>
  );
}
