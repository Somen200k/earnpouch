import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export const postDirectory = path.join(process.cwd(), "content", "posts");
export const categories = ["Reward Apps", "Side Hustles", "Smart Budgeting", "Remote Work"] as const;
export type PostCategory = (typeof categories)[number];
export type PostFaq = { question: string; answer: string };
export type ComparisonEntry = { name: string; bonus: string; cashoutMin: string; payoutMethod: string; url?: string };
export type QuickPick = { name: string; rating?: number; reviewCount?: number; bonus: string; cashoutMin: string; payoutMethod: string; features: string[]; ctaLabel?: string };
export type Post = { slug: string; title: string; category: PostCategory; date: string; excerpt: string; coverImage?: string; primaryCpaUrl?: string; tags: string[]; published: boolean; content: string; faqs: PostFaq[]; quickPick?: QuickPick; comparison: ComparisonEntry[] };

function isCategory(value: unknown): value is PostCategory { return typeof value === "string" && categories.includes(value as PostCategory); }

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
    quickPick: data.quickPick && typeof data.quickPick === "object" ? data.quickPick as QuickPick : undefined,
    comparison: Array.isArray(data.comparison) ? data.comparison.filter((item: ComparisonEntry) => typeof item?.name === "string") : [],
  };
}

export function listPosts(includeUnpublished = false): Post[] {
  if (!fs.existsSync(postDirectory)) return [];
  return fs.readdirSync(postDirectory).filter((file) => file.endsWith(".md"))
    .map((file) => parsePost(file.slice(0, -3), fs.readFileSync(path.join(postDirectory, file), "utf8")))
    .filter((post): post is Post => post !== null && (includeUnpublished || post.published))
    .sort((first, second) => second.date.localeCompare(first.date));
}

export function getPost(slug: string): Post | undefined {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return undefined;
  const file = path.join(postDirectory, `${slug}.md`);
  if (!fs.existsSync(file)) return undefined;
  const post = parsePost(slug, fs.readFileSync(file, "utf8"));
  return post?.published ? post : undefined;
}

