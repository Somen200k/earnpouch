import fs from "node:fs";
import path from "node:path";
import { categories } from "@/lib/category-url";

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
  description: "Straightforward guides to reward apps, career opportunities, side income, giveaways, and smarter budgets.",
  navLinks: ["Reward Apps", "Career & Side Income", "Smart Budgeting", "Giveaways & Sweepstakes"],
  categories: [
    { name: "Reward Apps", description: "Explore app-install and CPI offers. Review each app and game install's requirements, eligibility, and payout terms." },
    { name: "Career & Side Income", description: "Explore job-search resources, flexible side hustles, and practical ways to earn extra income." },
    { name: "Smart Budgeting", description: "Practical guidance for planning spending, saving, and making informed money decisions." },
    { name: "Giveaways & Sweepstakes", description: "Review third-party promotions, eligibility, entry requirements, and official rules before participating." },
  ],
  footerText: "Good information for earning, saving, and making the most of your money.",
  affiliateNotice: "EarnPouch is reader-supported. We may earn an affiliate commission when you sign up through our links at no extra cost to you.",
};

const filePath = path.join(process.cwd(), "content", "site-settings.json");

function normalizeSettings(data: Partial<SiteSettings> | null | undefined): SiteSettings {
  const settings = { ...defaultSiteSettings, ...(data ?? {}) };
  return {
    ...settings,
    navLinks: Array.isArray(data?.navLinks)
      ? [...new Set(data.navLinks
        .filter((value): value is string => typeof value === "string")
        .map((value) => value === "Side Hustles" || value === "Remote Work" ? "Career & Side Income" : value)
        .filter((value): value is (typeof categories)[number] => categories.includes(value as (typeof categories)[number])))]
      : defaultSiteSettings.navLinks,
    categories: defaultSiteSettings.categories.map((defaultCategory) => {
      const savedCategory = data?.categories?.find((category) => category?.name === defaultCategory.name);
      return {
        ...defaultCategory,
        ...(typeof savedCategory?.description === "string" ? { description: savedCategory.description } : {}),
      };
    }),
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
