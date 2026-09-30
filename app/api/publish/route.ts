import { timingSafeEqual } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { stringify } from "gray-matter";
import { revalidatePath } from "next/cache";
import { categories, postDirectory } from "@/lib/posts";
import { toSlug } from "@/lib/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PublishInput = {
  title?: unknown; slug?: unknown; category?: unknown; date?: unknown; excerpt?: unknown;
  coverImage?: unknown; primaryCpaUrl?: unknown; tags?: unknown; content?: unknown; published?: unknown;
};

function isHttpUrl(value: unknown): value is string {
  if (typeof value !== "string" || !value) return false;
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}

function matchesToken(provided: string, expected: string): boolean {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  return providedBuffer.length === expectedBuffer.length && timingSafeEqual(providedBuffer, expectedBuffer);
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 110_000) return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  const expectedToken = process.env.PUBLISH_TOKEN;
  if (!expectedToken || expectedToken.length < 24) return NextResponse.json({ error: "Publishing is not configured on this server." }, { status: 503 });
  const providedToken = request.headers.get("x-publish-token") ?? "";
  if (!matchesToken(providedToken, expectedToken)) return NextResponse.json({ error: "Invalid publishing token." }, { status: 401 });

  let body: PublishInput;
  try { body = await request.json() as PublishInput; }
  catch { return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 }); }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const slug = typeof body.slug === "string" ? body.slug : "";
  const category = body.category;
  const date = typeof body.date === "string" ? body.date : "";
  const excerpt = typeof body.excerpt === "string" ? body.excerpt.trim() : "";
  const content = typeof body.content === "string" ? body.content : "";
  const tags = Array.isArray(body.tags) ? body.tags.filter((tag): tag is string => typeof tag === "string").map((tag) => tag.trim()).filter(Boolean).slice(0, 20) : [];

  if (title.length < 5 || title.length > 160) return NextResponse.json({ error: "Title must be between 5 and 160 characters." }, { status: 400 });
  if (!slug || slug.length > 90 || toSlug(slug) !== slug) return NextResponse.json({ error: "Slug must use lowercase letters, numbers, and single hyphens." }, { status: 400 });
  if (typeof category !== "string" || !categories.includes(category as (typeof categories)[number])) return NextResponse.json({ error: "Choose a valid category." }, { status: 400 });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`)) || new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date) return NextResponse.json({ error: "Enter a valid publication date." }, { status: 400 });
  if (excerpt.length < 30 || excerpt.length > 300) return NextResponse.json({ error: "Excerpt must be between 30 and 300 characters." }, { status: 400 });
  if (content.trim().length < 100 || content.length > 100000) return NextResponse.json({ error: "Content must be between 100 and 100,000 characters." }, { status: 400 });
  if (body.coverImage && !isHttpUrl(body.coverImage)) return NextResponse.json({ error: "Cover image must use an HTTPS URL." }, { status: 400 });
  if (body.primaryCpaUrl && !isHttpUrl(body.primaryCpaUrl)) return NextResponse.json({ error: "Primary offer link must use an HTTPS URL." }, { status: 400 });
  if (typeof body.published !== "boolean") return NextResponse.json({ error: "Published must be true or false." }, { status: 400 });

  const frontmatter = {
    title, category, date, excerpt,
    ...(typeof body.coverImage === "string" && body.coverImage ? { coverImage: body.coverImage } : {}),
    ...(typeof body.primaryCpaUrl === "string" && body.primaryCpaUrl ? { primaryCpaUrl: body.primaryCpaUrl } : {}),
    tags, published: body.published,
  };
  const filePath = path.join(postDirectory, `${slug}.md`);
  try {
    await mkdir(postDirectory, { recursive: true });
    await writeFile(filePath, stringify(content, frontmatter), { encoding: "utf8", mode: 0o600 });
  } catch {
    return NextResponse.json({ error: "Could not write the markdown file. Check server storage permissions." }, { status: 500 });
  }
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");
  return NextResponse.json({ ok: true, slug, published: body.published }, { status: 201 });
}