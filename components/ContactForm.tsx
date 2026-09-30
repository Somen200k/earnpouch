"use client";
import { FormEvent, useState } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`EarnPouch inquiry: ${String(values.get("topic"))}`);
    const body = encodeURIComponent(`Name: ${String(values.get("name"))}\nEmail: ${String(values.get("email"))}\n\n${String(values.get("message"))}`);
    window.location.href = `mailto:support@earnpouch.com?subject=${subject}&body=${body}`;
    setSent(true);
  }
  return <form onSubmit={submit} className="space-y-5"><div className="grid gap-5 sm:grid-cols-2"><label className="block text-sm font-semibold text-slate-800">Name<input name="name" autoComplete="name" required maxLength={100} className="mt-2 block min-h-11 w-full border border-slate-300 bg-white px-3 font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label><label className="block text-sm font-semibold text-slate-800">Email<input name="email" type="email" autoComplete="email" required maxLength={254} className="mt-2 block min-h-11 w-full border border-slate-300 bg-white px-3 font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label></div><label className="block text-sm font-semibold text-slate-800">Topic<select name="topic" className="mt-2 block min-h-11 w-full border border-slate-300 bg-white px-3 font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"><option>Editorial feedback</option><option>Privacy request</option><option>Partnership inquiry</option><option>Other</option></select></label><label className="block text-sm font-semibold text-slate-800">Message<textarea name="message" required minLength={10} maxLength={5000} rows={5} className="mt-2 block w-full resize-y border border-slate-300 bg-white px-3 py-2 font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label><button type="submit" className="inline-flex min-h-12 items-center gap-2 rounded-md bg-green-600 px-5 text-sm font-bold text-white hover:bg-green-700">Prepare email <ArrowUpRight size={16} /></button>{sent && <p role="status" className="inline-flex items-center gap-2 text-sm text-emerald-800"><CheckCircle2 size={16} /> Your email app should open with the message ready to send.</p>}<p className="text-xs leading-5 text-slate-500">Submitting opens your email application; your message is not sent to us until you send it there.</p></form>;
}