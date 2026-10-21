import type { Post } from "@/lib/posts";

export function getCtaButtonLabel(post: Post): string {
  const configuredLabel = post.quickPick?.ctaLabel?.trim().replace(/(?:\s*➔)+\s*$/, "");
  if (configuredLabel) return configuredLabel;

  switch (post.category) {
    case "Giveaways & Sweepstakes":
      return "Review Promotion Details";
    case "Reward Apps":
      return "Review App Requirements";
    case "Smart Budgeting":
      return "Review Eligibility Options";
    case "Career & Side Income": {
      const context = `${post.title} ${post.quickPick?.name ?? ""}`;
      if (/\b(job|opening|employment|career|warehouse|retail)\b/i.test(context)) {
        return "Search Openings Near You";
      }
      if (/\b(survey|panel)\b/i.test(context)) return "Browse Available Panels";
      return "Review Offer Requirements";
    }
  }
}
