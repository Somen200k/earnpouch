import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin-auth";
import { readSiteSettings, writeSiteSettings, type SiteSettings } from "@/lib/site-settings";

function sanitizeSettings(raw: unknown): SiteSettings {
  const data = (raw && typeof raw === "object" ? raw : {}) as Partial<SiteSettings>;
  const next = readSiteSettings();

  return {
    ...next,
    siteName: typeof data.siteName === "string" ? data.siteName.trim() || next.siteName : next.siteName,
    tagline: typeof data.tagline === "string" ? data.tagline.trim() || next.tagline : next.tagline,
    heroTitle: typeof data.heroTitle === "string" ? data.heroTitle.trim() || next.heroTitle : next.heroTitle,
    heroSubtitle: typeof data.heroSubtitle === "string" ? data.heroSubtitle.trim() || next.heroSubtitle : next.heroSubtitle,
    heroBadge: typeof data.heroBadge === "string" ? data.heroBadge.trim() || next.heroBadge : next.heroBadge,
    description: typeof data.description === "string" ? data.description.trim() || next.description : next.description,
    footerText: typeof data.footerText === "string" ? data.footerText.trim() || next.footerText : next.footerText,
    affiliateNotice: typeof data.affiliateNotice === "string" ? data.affiliateNotice.trim() || next.affiliateNotice : next.affiliateNotice,
    navLinks: Array.isArray(data.navLinks) ? data.navLinks.filter((value): value is string => typeof value === "string").map((value) => value.trim()).filter(Boolean) : next.navLinks,
    categories: Array.isArray(data.categories) ? data.categories.filter((item): item is { name: string; description: string } => !!item && typeof item === "object" && typeof (item as { name?: unknown }).name === "string" && typeof (item as { description?: unknown }).description === "string")
      .map((item) => ({ name: item.name.trim(), description: item.description.trim() }))
      .filter((item) => item.name && item.description) : next.categories,
  };
}

export async function GET() {
  const sessionToken = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value ?? "";
  if (!verifyAdminSessionToken(sessionToken)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(readSiteSettings());
}

export async function POST(request: Request) {
  const sessionToken = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value ?? "";
  if (!verifyAdminSessionToken(sessionToken)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  try {
    const settings = sanitizeSettings(body);
    const saved = writeSiteSettings(settings);
    return NextResponse.json(saved, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Could not save site settings." }, { status: 500 });
  }
}
