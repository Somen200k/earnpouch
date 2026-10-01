"use client";

import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from "react";
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

type SiteSettingsState = {
	siteName: string;
	tagline: string;
	heroTitle: string;
	heroSubtitle: string;
	heroBadge: string;
	footerText: string;
	affiliateNotice: string;
	navLinks: string;
	categoriesText: string;
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

const initialSiteSettings: SiteSettingsState = {
	siteName: "EarnPouch",
	tagline: "Make your money go further.",
	heroTitle: "Make your money go further.",
	heroSubtitle: "Clear-eyed guides to earning a little extra, finding useful rewards, and making a budget that works in real life.",
	heroBadge: "Practical money guides",
	footerText: "Good information for earning, saving, and making the most of your money.",
	affiliateNotice: "EarnPouch is reader-supported. We may earn an affiliate commission when you sign up through our links at no extra cost to you.",
	navLinks: "Reward Apps, Side Hustles, Smart Budgeting, Remote Work",
	categoriesText: "Reward Apps | Get more from the time you already spend online.\nSide Hustles | Flexible ways to put your skills and spare hours to work.\nSmart Budgeting | Simple systems for keeping more of what you earn.\nRemote Work | Find legitimate opportunities beyond the office.",
};

export function AdminEditor({ storageMode }: { storageMode: "GitHub" | "Local filesystem" }) {
	const [tab, setTab] = useState<Tab>("Blog");
	const [draft, setDraft] = useState<Draft>(initialDraft);
	const [slugEdited, setSlugEdited] = useState(false);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState<{ error: boolean; text: string } | null>(null);
	const [siteSettings, setSiteSettings] = useState<SiteSettingsState>(initialSiteSettings);
	const [settingsSaving, setSettingsSaving] = useState(false);
	const [settingsMessage, setSettingsMessage] = useState<{ error: boolean; text: string } | null>(null);
	const wordCount = useMemo(() => draft.content.trim() ? draft.content.trim().split(/\s+/).length : 0, [draft.content]);

	useEffect(() => {
		fetch("/api/admin/settings")
			.then((response) => response.ok ? response.json() : null)
			.then((data) => {
				if (!data) return;
				setSiteSettings({
					siteName: typeof data.siteName === "string" ? data.siteName : initialSiteSettings.siteName,
					tagline: typeof data.tagline === "string" ? data.tagline : initialSiteSettings.tagline,
					heroTitle: typeof data.heroTitle === "string" ? data.heroTitle : initialSiteSettings.heroTitle,
					heroSubtitle: typeof data.heroSubtitle === "string" ? data.heroSubtitle : initialSiteSettings.heroSubtitle,
					heroBadge: typeof data.heroBadge === "string" ? data.heroBadge : initialSiteSettings.heroBadge,
					footerText: typeof data.footerText === "string" ? data.footerText : initialSiteSettings.footerText,
					affiliateNotice: typeof data.affiliateNotice === "string" ? data.affiliateNotice : initialSiteSettings.affiliateNotice,
					navLinks: Array.isArray(data.navLinks) ? data.navLinks.join(", ") : initialSiteSettings.navLinks,
					categoriesText: Array.isArray(data.categories) ? data.categories.map((category: { name?: string; description?: string }) => `${category.name ?? ""} | ${category.description ?? ""}`).filter((item: string) => item !== " | ").join("\n") : initialSiteSettings.categoriesText,
				});
			})
			.catch(() => undefined);
	}, []);

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

	async function saveSiteSettings(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setSettingsSaving(true);
		setSettingsMessage(null);

		try {
			const navLinks = siteSettings.navLinks.split(/[\n,]+/).map((value) => value.trim()).filter(Boolean);
			const categoriesFromText = siteSettings.categoriesText
				.split(/\n+/)
				.map((line) => line.trim())
				.filter(Boolean)
				.map((line) => {
					const [name, ...rest] = line.split("|");
					return {
						name: (name ?? "").trim(),
						description: rest.join("|").trim(),
					};
				})
				.filter((category) => category.name && category.description);

			const response = await fetch("/api/admin/settings", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					siteName: siteSettings.siteName,
					tagline: siteSettings.tagline,
					heroTitle: siteSettings.heroTitle,
					heroSubtitle: siteSettings.heroSubtitle,
					heroBadge: siteSettings.heroBadge,
					footerText: siteSettings.footerText,
					affiliateNotice: siteSettings.affiliateNotice,
					navLinks,
					categories: categoriesFromText,
				}),
			});
			const result = await response.json() as { error?: string };
			if (!response.ok) throw new Error(result.error ?? "Unable to save site settings.");
			setSettingsMessage({ error: false, text: "Site settings updated successfully." });
		} catch (error) {
			setSettingsMessage({ error: true, text: error instanceof Error ? error.message : "Unable to save site settings." });
		} finally {
			setSettingsSaving(false);
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
					<span className="inline-flex items-center gap-2 rounded-full border border-emerald-800 bg-emerald-950/70 px-3 py-1.5 text-xs font-semibold text-emerald-300"><GitBranch size={14} />{storageMode === "GitHub" ? "GitHub Connected" : "Local storage"}</span>
					<button type="button" onClick={logout} className="inline-flex min-h-10 items-center rounded border border-slate-700 bg-slate-900 px-3 text-xs font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white">Log out</button>
				</div>
			</div>
			<nav className="mx-auto flex max-w-7xl gap-1 px-5 sm:px-8 lg:px-12" aria-label="Admin sections">
				{tabs.map(({ name, Icon }) => <button key={name} type="button" onClick={() => setTab(name)} aria-current={tab === name ? "page" : undefined} className={`inline-flex min-h-11 items-center gap-2 border-b-2 px-4 text-sm font-semibold ${tab === name ? "border-amber-400 text-amber-300" : "border-transparent text-slate-400 hover:text-slate-100"}`}><Icon size={15} />{name}</button>)}
			</nav>
		</header>

		<div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-12">
			{tab === "Blog" ? <form onSubmit={submit} className="space-y-6">
				<div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-lg font-semibold">Create a post</h2><p className="mt-1 text-sm text-slate-400">Markdown articles are saved to the content library.</p></div><div className="flex items-center gap-2"><span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-300">{storageMode === "GitHub" ? "GitHub sync" : "Local storage"}</span><label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded border border-slate-700 bg-slate-900 px-3 text-sm"><input type="checkbox" checked={draft.published} onChange={(event) => update("published", event.target.checked)} className="h-4 w-4 accent-emerald-500" />Published</label></div></div>
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
				<div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-5"><p className="inline-flex items-center gap-2 text-xs leading-5 text-slate-500"><LockKeyhole size={14} />Signed-in admin session • {storageMode}</p><button type="submit" disabled={saving} className="inline-flex min-h-12 items-center gap-2 rounded bg-amber-400 px-5 text-sm font-extrabold text-slate-950 transition hover:bg-amber-300 disabled:cursor-wait disabled:opacity-60"><Sparkles size={16} />{saving ? "Saving..." : draft.published ? "Publish Post" : "Save Draft"}</button></div>
				{message && <p role="status" className={`inline-flex items-center gap-2 text-sm ${message.error ? "text-red-300" : "text-emerald-300"}`}>{!message.error && <Check size={16} />}{message.text}</p>}
			</form> : tab === "SEO" ? <section><h2 className="text-lg font-semibold">Search presentation</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Published articles use their title and excerpt for search and social metadata.</p><div className="mt-6 divide-y divide-slate-800 border-y border-slate-800">{[["Canonical host", "https://www.earnpouch.com"], ["Sitemap", "/sitemap.xml"], ["Robots policy", "/robots.txt"]].map(([label, value]) => <div key={label} className="flex justify-between gap-3 py-4 text-sm"><span className="text-slate-400">{label}</span><span className="font-medium text-slate-200">{value}</span></div>)}</div></section> : <form onSubmit={saveSiteSettings} className="space-y-6"><div><h2 className="text-lg font-semibold">Website settings</h2><p className="mt-1 text-sm text-slate-400">Update the brand, homepage copy, and navigation from this dashboard.</p></div>
				<div className="grid gap-5 sm:grid-cols-2">
					<label className={labelClass}>Site name<input className={inputClass} value={siteSettings.siteName} onChange={(event) => setSiteSettings((current) => ({ ...current, siteName: event.target.value }))} /></label>
					<label className={labelClass}>Tagline<input className={inputClass} value={siteSettings.tagline} onChange={(event) => setSiteSettings((current) => ({ ...current, tagline: event.target.value }))} /></label>
					<label className={`${labelClass} sm:col-span-2`}>Hero title<textarea className={`${inputClass} min-h-20 resize-y py-3`} value={siteSettings.heroTitle} onChange={(event) => setSiteSettings((current) => ({ ...current, heroTitle: event.target.value }))} /></label>
					<label className={`${labelClass} sm:col-span-2`}>Hero subtitle<textarea className={`${inputClass} min-h-24 resize-y py-3`} value={siteSettings.heroSubtitle} onChange={(event) => setSiteSettings((current) => ({ ...current, heroSubtitle: event.target.value }))} /></label>
					<label className={labelClass}>Hero badge<input className={inputClass} value={siteSettings.heroBadge} onChange={(event) => setSiteSettings((current) => ({ ...current, heroBadge: event.target.value }))} /></label>
					<label className={labelClass}>Footer text<input className={inputClass} value={siteSettings.footerText} onChange={(event) => setSiteSettings((current) => ({ ...current, footerText: event.target.value }))} /></label>
					<label className={`${labelClass} sm:col-span-2`}>Affiliate notice<textarea className={`${inputClass} min-h-24 resize-y py-3`} value={siteSettings.affiliateNotice} onChange={(event) => setSiteSettings((current) => ({ ...current, affiliateNotice: event.target.value }))} /></label>
					<label className={`${labelClass} sm:col-span-2`}>Navigation links (comma-separated)<input className={inputClass} value={siteSettings.navLinks} onChange={(event) => setSiteSettings((current) => ({ ...current, navLinks: event.target.value }))} /></label>
					<label className={`${labelClass} sm:col-span-2`}>Categories (format: Name | Description, one per line)<textarea className={`${inputClass} min-h-32 resize-y py-3 font-mono text-[13px]`} value={siteSettings.categoriesText} onChange={(event) => setSiteSettings((current) => ({ ...current, categoriesText: event.target.value }))} /></label>
				</div>
				<div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-5"><p className="inline-flex items-center gap-2 text-xs leading-5 text-slate-500"><LockKeyhole size={14} />Admin settings are saved to the site configuration file.</p><button type="submit" disabled={settingsSaving} className="inline-flex min-h-12 items-center gap-2 rounded bg-amber-400 px-5 text-sm font-extrabold text-slate-950 transition hover:bg-amber-300 disabled:cursor-wait disabled:opacity-60"><Sparkles size={16} />{settingsSaving ? "Saving..." : "Save website settings"}</button></div>
				{settingsMessage && <p role="status" className={`inline-flex items-center gap-2 text-sm ${settingsMessage.error ? "text-red-300" : "text-emerald-300"}`}>{!settingsMessage.error && <Check size={16} />}{settingsMessage.text}</p>}
			</form>}
		</div>
	</main>;
}
