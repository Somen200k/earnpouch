import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { categories, type PostCategory } from "@/lib/category-url";

export const postDirectory = path.join(process.cwd(), "content", "posts");
const pinnedPostOrder = new Map([
  "nike-gift-card-giveaway-how-to-enter-2026",
  "claim-cash-app-rewards-guide-2026",
  "free-walmart-gift-cards-guide-2026",
].map((slug, index) => [slug, index]));
export type PostFaq = { question: string; answer: string };
export type ComparisonEntry = { name: string; bonus: string; cashoutMin: string; payoutMethod: string; url?: string };
export type QuickPick = { name: string; rating?: number; reviewCount?: number; bonus: string; cashoutMin: string; payoutMethod: string; features: string[]; steps?: string[]; ctaLabel?: string; mobileCtaNotice?: string; nextStepTitle?: string; nextStepDescription?: string; disclaimer?: string };
export type Post = { slug: string; title: string; category: PostCategory; date: string; excerpt: string; coverImage?: string; primaryCpaUrl?: string; tags: string[]; published: boolean; content: string; faqs: PostFaq[]; quickPick?: QuickPick; comparison: ComparisonEntry[] };

function isCategory(value: unknown): value is PostCategory { return typeof value === "string" && categories.includes(value as PostCategory); }

function parseQuickPick(value: unknown, title: string): QuickPick | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const data = value as Record<string, unknown>;
  const optionalText = (key: string) => typeof data[key] === "string" ? data[key] as string : undefined;
  return {
    name: optionalText("name") ?? title,
    bonus: optionalText("bonus") ?? "See current offer",
    cashoutMin: optionalText("cashoutMin") ?? "Varies",
    payoutMethod: optionalText("payoutMethod") ?? "Check provider terms",
    features: Array.isArray(data.features) && data.features.some((item) => typeof item === "string")
      ? data.features.filter((item): item is string => typeof item === "string")
      : [
        "Check whether the offer is available in your area",
        "Review the required steps and terms",
        "Confirm details directly with the provider",
      ],
    ...(typeof data.rating === "number" ? { rating: data.rating } : {}),
    ...(typeof data.reviewCount === "number" ? { reviewCount: data.reviewCount } : {}),
    ...(Array.isArray(data.steps) ? { steps: data.steps.filter((item): item is string => typeof item === "string") } : {}),
    ...(["ctaLabel", "mobileCtaNotice", "nextStepTitle", "nextStepDescription", "disclaimer"] as const)
      .reduce<Pick<QuickPick, "ctaLabel" | "mobileCtaNotice" | "nextStepTitle" | "nextStepDescription" | "disclaimer">>((fields, key) => {
        const text = optionalText(key);
        return text === undefined ? fields : { ...fields, [key]: text };
      }, {}),
  };
}

function parsePost(slug: string, source: string): Post | null {
  const { data, content } = matter(source);
  if (typeof data.title !== "string" || !isCategory(data.category) || typeof data.date !== "string" || typeof data.excerpt !== "string") return null;
  return {
    slug, title: data.title, category: data.category, date: data.date, excerpt: data.excerpt,
    coverImage: typeof data.coverImage === "string" ? data.coverImage : undefined,
    primaryCpaUrl: typeof data.primaryCpaUrl === "string" ? data.primaryCpaUrl : undefined,
    tags: Array.isArray(data.tags) ? data.tags.filter((tag: unknown): tag is string => typeof tag === "string") : [],
    published: data.published === true, content,
    faqs: Array.isArray(data.faqs) ? data.faqs.filter((faq: PostFaq) => typeof faq?.question === "string" && typeof faq?.answer === "string") : [],
    quickPick: parseQuickPick(data.quickPick, data.title),
    comparison: Array.isArray(data.comparison) ? data.comparison.filter((item: ComparisonEntry) => typeof item?.name === "string") : [],
  };
}

export function listPosts(includeUnpublished = false): Post[] {
  if (!fs.existsSync(postDirectory)) return [];
  return fs.readdirSync(postDirectory).filter((file) => file.endsWith(".md"))
    .map((file) => parsePost(file.slice(0, -3), fs.readFileSync(path.join(postDirectory, file), "utf8")))
    .filter((post): post is Post => post !== null && (includeUnpublished || post.published))
    .sort((first, second) => {
      const firstPinned = pinnedPostOrder.get(first.slug);
      const secondPinned = pinnedPostOrder.get(second.slug);
      if (firstPinned !== undefined || secondPinned !== undefined) {
        if (firstPinned === undefined) return 1;
        if (secondPinned === undefined) return -1;
        return firstPinned - secondPinned;
      }
      return second.date.localeCompare(first.date);
    });
}

export function getPost(slug: string): Post | undefined {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return undefined;
  const file = path.join(postDirectory, `${slug}.md`);
  if (!fs.existsSync(file)) return undefined;
  const post = parsePost(slug, fs.readFileSync(file, "utf8"));
  return post?.published ? post : undefined;
}
