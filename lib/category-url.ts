export const categories = ["Reward Apps", "Career & Side Income", "Smart Budgeting", "Giveaways & Sweepstakes"] as const;
export type PostCategory = (typeof categories)[number];

const legacyCategorySlugs: Record<string, PostCategory> = {
  "side-hustles": "Career & Side Income",
  "remote-work": "Career & Side Income",
};

export function categorySlug(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function categoryFromSlug(slug: string): PostCategory | undefined {
  return legacyCategorySlugs[slug] ?? categories.find((category) => categorySlug(category) === slug);
}

export function categoryPath(category: string): string {
  return `/blog/category/${categorySlug(category)}`;
}
