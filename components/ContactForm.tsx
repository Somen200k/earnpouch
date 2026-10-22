"use client";

import { FormEvent, useState } from "react";
import { AlertCircle, CheckCircle2, LoaderCircle, Send } from "lucide-react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");
    setError("");

    const values = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.get("name"),
          email: values.get("email"),
          topic: values.get("topic"),
          message: values.get("message"),
          website: values.get("website"),
        }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) {
        setError(result.error ?? "We couldn’t send your message. Please try again.");
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("success");
    } catch {
      setError("We couldn’t reach the server. Please try again or email support@earnpouch.com.");
      setStatus("error");
    }
  }

  return <form onSubmit={submit} className="space-y-5">
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="block text-sm font-semibold text-slate-800">Name<input name="name" autoComplete="name" required maxLength={100} className="mt-2 block min-h-11 w-full border border-slate-300 bg-white px-3 font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>
      <label className="block text-sm font-semibold text-slate-800">Email<input name="email" type="email" autoComplete="email" required maxLength={254} className="mt-2 block min-h-11 w-full border border-slate-300 bg-white px-3 font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>
    </div>
    <label className="block text-sm font-semibold text-slate-800">Topic<select name="topic" className="mt-2 block min-h-11 w-full border border-slate-300 bg-white px-3 font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"><option>Editorial feedback</option><option>Privacy request</option><option>Partnership inquiry</option><option>Other</option></select></label>
    <label className="block text-sm font-semibold text-slate-800">Message<textarea name="message" required minLength={10} maxLength={5000} rows={5} className="mt-2 block w-full resize-y border border-slate-300 bg-white px-3 py-2 font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>
    <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <button type="submit" disabled={status === "sending"} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#00a86b] px-5 text-sm font-bold text-white transition-colors hover:bg-[#008f5a] disabled:cursor-wait disabled:opacity-70">
      {status === "sending" ? <>Sending<LoaderCircle size={16} className="animate-spin" /></> : <>Send message<Send size={16} /></>}
    </button>
    {status === "success" && <p role="status" className="inline-flex items-center gap-2 text-sm text-emerald-800"><CheckCircle2 size={16} /> Your message was sent. We’ll get back to you within three business days.</p>}
    {status === "error" && <p role="alert" className="inline-flex items-center gap-2 text-sm text-red-700"><AlertCircle size={16} /> {error}</p>}
    <p className="text-xs leading-5 text-slate-500">Your message will be emailed directly to support@earnpouch.com.</p>
  </form>;
}
