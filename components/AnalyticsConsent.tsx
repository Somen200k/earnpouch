"use client";
import { useEffect, useState } from "react";

const consentKey = "earnpouch-analytics-consent";

export function AnalyticsConsent({ measurementId }: { measurementId?: string }) {
  const [visible, setVisible] = useState(false);
  const [accepted, setAccepted] = useState(false);
  useEffect(() => { const choice = window.localStorage.getItem(consentKey); setAccepted(choice === "accepted"); setVisible(Boolean(measurementId) && choice === null); }, [measurementId]);
  useEffect(() => {
    if (!accepted || !measurementId || document.getElementById("earnpouch-ga")) return;
    const script = document.createElement("script"); script.id = "earnpouch-ga"; script.async = true; script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`; document.head.appendChild(script);
    const inline = document.createElement("script"); inline.id = "earnpouch-ga-config"; inline.text = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${measurementId.replace(/[^A-Za-z0-9_-]/g, "")}');`; document.head.appendChild(inline);
  }, [accepted, measurementId]);
  if (!visible || !measurementId) return null;
  const choose = (value: "accepted" | "rejected") => { window.localStorage.setItem(consentKey, value); setAccepted(value === "accepted"); setVisible(false); };
  return <aside className="fixed bottom-4 left-4 right-4 z-50 mx-auto flex max-w-3xl flex-col gap-4 border border-slate-300 bg-white p-4 shadow-xl sm:flex-row sm:items-center sm:justify-between"><p className="max-w-xl text-sm leading-5 text-slate-600">We use optional analytics to understand which guides help. You can accept or reject analytics cookies.</p><div className="flex shrink-0 gap-2"><button onClick={() => choose("rejected")} className="min-h-10 border border-slate-300 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Reject</button><button onClick={() => choose("accepted")} className="min-h-10 bg-slate-900 px-3 text-sm font-semibold text-white hover:bg-slate-700">Allow analytics</button></div></aside>;
}