import fs from "node:fs";
import path from "node:path";

export type SiteSettingCategory = {
  name: string;
  description: string;
};

export type SiteSettings = {
  siteName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  description: string;
  navLinks: string[];
  categories: SiteSettingCategory[];
  footerText: string;
  affiliateNotice: string;
};

export const defaultSiteSettings: SiteSettings = {
  siteName: "EarnPouch",
  tagline: "Make your money go further.",
  heroTitle: "Make your money go further.",
  heroSubtitle: "Clear-eyed guides to earning a little extra, finding useful rewards, and making a budget that works in real life.",
  heroBadge: "Practical money guides",
  description: "Straightforward guides to reward apps, flexible side hustles, smarter budgets, and remote work.",
  navLinks: ["Reward Apps", "Side Hustles", "Smart Budgeting", "Remote Work"],
  categories: [
    { name: "Reward Apps", description: "Get more from the time you already spend online." },
    { name: "Side Hustles", description: "Flexible ways to put your skills and spare hours to work." },
    { name: "Smart Budgeting", description: "Simple systems for keeping more of what you earn." },
    { name: "Remote Work", description: "Find legitimate opportunities beyond the office." },
  ],
  footerText: "Good information for earning, saving, and making the most of your money.",
  affiliateNotice: "EarnPouch is reader-supported. We may earn an affiliate commission when you sign up through our links at no extra cost to you.",
};

const filePath = path.join(process.cwd(), "content", "site-settings.json");

function normalizeSettings(data: Partial<SiteSettings> | null | undefined): SiteSettings {
  const settings = { ...defaultSiteSettings, ...(data ?? {}) };
  return {
    ...settings,
    navLinks: Array.isArray(data?.navLinks) ? data!.navLinks.filter((value): value is string => typeof value === "string") : defaultSiteSettings.navLinks,
    categories: Array.isArray(data?.categories) ? data!.categories.filter((category): category is SiteSettingCategory => !!category && typeof category.name === "string" && typeof category.description === "string") : defaultSiteSettings.categories,
  };
}

export function readSiteSettings(): SiteSettings {
  try {
    if (!fs.existsSync(filePath)) {
      return defaultSiteSettings;
    }
    const contents = fs.readFileSync(filePath, "utf8");
    if (!contents.trim()) {
      return defaultSiteSettings;
    }
    const parsed = JSON.parse(contents) as Partial<SiteSettings> | null;
    return normalizeSettings(parsed);
  } catch {
    return defaultSiteSettings;
  }
}

export function writeSiteSettings(settings: SiteSettings): SiteSettings {
  const normalized = normalizeSettings(settings);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(normalized, null, 2) + "\n", "utf8");
  return normalized;
}
