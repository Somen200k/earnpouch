export const categories = ["Reward Apps", "Side Hustles", "Smart Budgeting", "Remote Work"] as const;
export type PostCategory = (typeof categories)[number];

export function categorySlug(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function categoryFromSlug(slug: string): PostCategory | undefined {
  return categories.find((category) => categorySlug(category) === slug);
}

export function categoryPath(category: string): string {
  return `/blog/category/${categorySlug(category)}`;
}
