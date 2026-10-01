"use client";

import { type ChangeEvent, type FormEvent, useMemo, useState } from "react";
import { Check, FileText, GitBranch, LockKeyhole, Search, Settings2, Sparkles } from "lucide-react";
import { toSlug } from "@/lib/slug";

const categories = ["Reward Apps", "Side Hustles", "Smart Budgeting", "Remote Work"] as const;
type Tab = "Blog" | "SEO" | "Settings";
type Draft = {
	title: string;
	slug: string;
	category: (typeof categories)[number];
	date: string;
	excerpt: string;
	coverImage: string;
	tags: string;
	primaryCpaUrl: string;
	content: string;
	published: boolean;
};

const initialDraft: Draft = {
	title: "",
	slug: "",
	category: "Reward Apps",
	date: new Date().toISOString().slice(0, 10),
	excerpt: "",
	coverImage: "",
	tags: "",
	primaryCpaUrl: "",
	content: "",
	published: false,
};

export function AdminEditor() {
	const [tab, setTab] = useState<Tab>("Blog");
	const [draft, setDraft] = useState<Draft>(initialDraft);
	const [slugEdited, setSlugEdited] = useState(false);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState<{ error: boolean; text: string } | null>(null);
	const wordCount = useMemo(() => draft.content.trim() ? draft.content.trim().split(/\s+/).length : 0, [draft.content]);

	function update<K extends keyof Draft>(field: K, value: Draft[K]) {
		setDraft((current) => ({
			...current,
			[field]: value,
			...(field === "title" && !slugEdited ? { slug: toSlug(String(value)) } : {}),
		}));
	}

	function updateSlug(event: ChangeEvent<HTMLInputElement>) {
		setSlugEdited(true);
		update("slug", toSlug(event.target.value));
	}

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setSaving(true);
		setMessage(null);
		try {
			const response = await fetch("/api/publish", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...draft,
					tags: draft.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
				}),
			});
			const result = await response.json() as { error?: string; slug?: string };
			if (!response.ok) throw new Error(result.error ?? "Unable to save this post.");
			setMessage({ error: false, text: `${draft.published ? "Published" : "Saved draft"}: ${result.slug}.md` });
		} catch (error) {
			setMessage({ error: true, text: error instanceof Error ? error.message : "Unable to reach the publishing service." });
		} finally {
			setSaving(false);
		}
	}

	const inputClass = "mt-2 block min-h-11 w-full rounded border border-[#334155] bg-[#0f172a] px-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20";
	const labelClass = "block text-sm font-medium text-slate-300";

	async function logout() {
		try {
			await fetch("/api/admin/logout", { method: "POST" });
			window.location.href = "/admin/login";
		} catch {
			window.location.href = "/admin/login";
		}
	}

	const tabs = [
		{ name: "Blog" as const, Icon: FileText },
		{ name: "SEO" as const, Icon: Search },
		{ name: "Settings" as const, Icon: Settings2 },
	];

	return <main className="min-h-[calc(100vh-72px)] bg-[#0b1120] text-slate-100">
		<header className="border-b border-slate-800 bg-[#111827]">
			<div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-12">
				<div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-400">EarnPouch workspace</p><h1 className="mt-1 text-xl font-bold">Content studio</h1></div>
				<div className="flex items-center gap-3">
					<span className="inline-flex items-center gap-2 rounded-full border border-emerald-800 bg-emerald-950/70 px-3 py-1.5 text-xs font-semibold text-emerald-300"><GitBranch size={14} />GitHub Connected</span>
					<button type="button" onClick={logout} className="inline-flex min-h-10 items-center rounded border border-slate-700 bg-slate-900 px-3 text-xs font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white">Log out</button>
				</div>
			</div>
			<nav className="mx-auto flex max-w-7xl gap-1 px-5 sm:px-8 lg:px-12" aria-label="Admin sections">
				{tabs.map(({ name, Icon }) => <button key={name} type="button" onClick={() => setTab(name)} aria-current={tab === name ? "page" : undefined} className={`inline-flex min-h-11 items-center gap-2 border-b-2 px-4 text-sm font-semibold ${tab === name ? "border-amber-400 text-amber-300" : "border-transparent text-slate-400 hover:text-slate-100"}`}><Icon size={15} />{name}</button>)}
			</nav>
		</header>

		<div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-12">
			{tab === "Blog" ? <form onSubmit={submit} className="space-y-6">
				<div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-lg font-semibold">Create a post</h2><p className="mt-1 text-sm text-slate-400">Markdown articles are saved to the content library.</p></div><label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded border border-slate-700 bg-slate-900 px-3 text-sm"><input type="checkbox" checked={draft.published} onChange={(event) => update("published", event.target.checked)} className="h-4 w-4 accent-emerald-500" />Published</label></div>
				<div className="grid gap-5 sm:grid-cols-2">
					<label className={labelClass}>Title<input className={inputClass} required minLength={5} maxLength={160} value={draft.title} onChange={(event) => update("title", event.target.value)} /></label>
					<label className={labelClass}>Slug<input className={inputClass} required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={draft.slug} onChange={updateSlug} /></label>
					<label className={labelClass}>Category<select className={inputClass} value={draft.category} onChange={(event) => update("category", event.target.value as Draft["category"])}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
					<label className={labelClass}>Date<input type="date" className={inputClass} required value={draft.date} onChange={(event) => update("date", event.target.value)} /></label>
					<label className={`${labelClass} sm:col-span-2`}>Excerpt / Meta description<textarea className={`${inputClass} min-h-24 resize-y py-3`} required minLength={30} maxLength={300} value={draft.excerpt} onChange={(event) => update("excerpt", event.target.value)} /></label>
					<label className={labelClass}>Cover image URL<input type="url" className={inputClass} value={draft.coverImage} onChange={(event) => update("coverImage", event.target.value)} /></label>
					<label className={labelClass}>Tags (comma-separated)<input className={inputClass} value={draft.tags} onChange={(event) => update("tags", event.target.value)} /></label>
					<label className={`${labelClass} sm:col-span-2`}>Primary CPA link / BeMob URL<input type="url" className={inputClass} value={draft.primaryCpaUrl} onChange={(event) => update("primaryCpaUrl", event.target.value)} /></label>
				</div>
				<label className={labelClass}>Content (Markdown)<textarea className={`${inputClass} min-h-[380px] resize-y py-3 font-mono text-[13px] leading-6`} required minLength={100} maxLength={100000} value={draft.content} onChange={(event) => update("content", event.target.value)} placeholder="## Start with the essentials&#10;&#10;Write useful, specific guidance here..." /><span className="mt-2 block text-xs text-slate-500">{wordCount.toLocaleString()} words</span></label>
				<div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-5"><p className="inline-flex items-center gap-2 text-xs leading-5 text-slate-500"><LockKeyhole size={14} />Signed-in admin session</p><button type="submit" disabled={saving} className="inline-flex min-h-12 items-center gap-2 rounded bg-amber-400 px-5 text-sm font-extrabold text-slate-950 transition hover:bg-amber-300 disabled:cursor-wait disabled:opacity-60"><Sparkles size={16} />{saving ? "Saving..." : draft.published ? "Publish Post" : "Save Draft"}</button></div>
				{message && <p role="status" className={`inline-flex items-center gap-2 text-sm ${message.error ? "text-red-300" : "text-emerald-300"}`}>{!message.error && <Check size={16} />}{message.text}</p>}
			</form> : tab === "SEO" ? <section><h2 className="text-lg font-semibold">Search presentation</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Published articles use their title and excerpt for search and social metadata.</p><div className="mt-6 divide-y divide-slate-800 border-y border-slate-800">{[["Canonical host", "https://www.earnpouch.com"], ["Sitemap", "/sitemap.xml"], ["Robots policy", "/robots.txt"]].map(([label, value]) => <div key={label} className="flex justify-between gap-3 py-4 text-sm"><span className="text-slate-400">{label}</span><span className="font-medium text-slate-200">{value}</span></div>)}</div></section> : <section><h2 className="text-lg font-semibold">Workspace settings</h2><div className="mt-6 divide-y divide-slate-800 border-y border-slate-800">{[["Publish authorization", "PUBLISH_TOKEN"], ["Analytics measurement", "NEXT_PUBLIC_GA_ID (optional)"], ["Content storage", "content/posts/*.md"]].map(([label, value]) => <div key={label} className="flex justify-between gap-3 py-4 text-sm"><span className="text-slate-400">{label}</span><span className="font-medium text-slate-200">{value}</span></div>)}</div></section>}
		</div>
	</main>;
}
