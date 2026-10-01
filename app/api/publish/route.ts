import { timingSafeEqual } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { stringify } from "gray-matter";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin-auth";
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

async function saveToGitHub(filePath: string, content: string): Promise<void> {
  const token = process.env.GITHUB_CONTENT_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY;
  const branch = process.env.GITHUB_BRANCH ?? "main";
  if (!token || !repository) throw new Error("GitHub content storage is not configured.");

  const apiUrl = `https://api.github.com/repos/${repository}/contents/${filePath}`;
  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };
  let sha: string | undefined;
  const existing = await fetch(`${apiUrl}?ref=${encodeURIComponent(branch)}`, { headers, cache: "no-store" });
  if (existing.ok) {
    const existingFile = await existing.json() as { sha?: string };
    sha = existingFile.sha;
  } else if (existing.status !== 404) {
    throw new Error("Could not check the existing GitHub post.");
  }

  const response = await fetch(apiUrl, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `Update post: ${path.basename(filePath, ".md")}`,
      content: Buffer.from(content, "utf8").toString("base64"),
      branch,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!response.ok) throw new Error("Could not save the post to GitHub.");
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 110_000) return NextResponse.json({ error: "Request is too large." }, { status: 413 });

  const sessionToken = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value ?? "";
  const authenticatedAdmin = verifyAdminSessionToken(sessionToken);
  const expectedToken = process.env.PUBLISH_TOKEN;
  const providedToken = request.headers.get("x-publish-token") ?? "";
  const validToken = Boolean(expectedToken && expectedToken.length >= 24 && matchesToken(providedToken, expectedToken));
  if (!authenticatedAdmin && !validToken) {
    if (!expectedToken || expectedToken.length < 24) return NextResponse.json({ error: "Publishing is not configured on this server." }, { status: 503 });
    return NextResponse.json({ error: "Your admin session has expired. Please sign in again." }, { status: 401 });
  }

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
    const markdown = stringify(content, frontmatter);
    if (process.env.GITHUB_CONTENT_TOKEN && process.env.GITHUB_REPOSITORY) {
      await saveToGitHub(`content/posts/${slug}.md`, markdown);
    } else {
      await mkdir(postDirectory, { recursive: true });
      await writeFile(filePath, markdown, { encoding: "utf8", mode: 0o600 });
    }
  } catch {
    return NextResponse.json({ error: "Could not save the post. Check the GitHub content settings or server storage permissions." }, { status: 500 });
  }
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");
  return NextResponse.json({ ok: true, slug, published: body.published }, { status: 201 });
}