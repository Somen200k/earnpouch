import type { Post } from "@/lib/posts";

export function ArticleStructuredData({ post }: { post: Post }) {
  const schemas: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `https://www.earnpouch.com/blog/${post.slug}#article`,
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      ...(post.lastReviewed ? { dateModified: post.lastReviewed } : {}),
      author: {
        "@type": "Organization",
        name: "EarnPouch Editorial Team",
      },
      publisher: {
        "@type": "Organization",
        name: "EarnPouch",
      },
      articleSection: post.category,
      keywords: post.tags,
      mainEntityOfPage: `https://www.earnpouch.com/blog/${post.slug}`,
      ...(post.coverImage ? { image: [post.coverImage] } : {}),
    },
  ];

  const rating = post.quickPick?.rating;
  const reviewCount = post.quickPick?.reviewCount;

  if (
    post.quickPick &&
    typeof rating === "number" &&
    Number.isFinite(rating) &&
    rating >= 1 &&
    rating <= 5 &&
    Number.isInteger(reviewCount) &&
    reviewCount !== undefined &&
    reviewCount > 0
  ) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `https://www.earnpouch.com/blog/${post.slug}#product`,
      name: post.quickPick.name,
      description: post.excerpt,
      url: `https://www.earnpouch.com/blog/${post.slug}`,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: rating,
        bestRating: 5,
        worstRating: 1,
        reviewCount,
      },
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": schemas }).replace(/</g, "\\u003c"),
      }}
    />
  );
}
