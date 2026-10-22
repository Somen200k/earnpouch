import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = { title: "Contact", description: "Contact the EarnPouch editorial team." };

export default function Contact() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="py-2">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#008f5a]">Get in touch</p>
          <h1 className="editorial-serif mt-3 text-4xl sm:text-5xl">Contact the editors</h1>
          <p className="mt-5 max-w-md text-base leading-7 text-slate-600">For corrections, privacy requests, partnership questions, or feedback on a guide, write to our editorial team.</p>
          <a href="mailto:support@earnpouch.com" className="mt-6 inline-block font-semibold text-[#008f5a] underline decoration-emerald-300 underline-offset-4">support@earnpouch.com</a>
          <p className="mt-2 text-sm text-slate-500">We aim to respond within three business days.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}