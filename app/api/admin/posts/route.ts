import { readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin-auth";
import { listPosts, postDirectory } from "@/lib/posts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function githubSettings() {
	const token = process.env.GITHUB_CONTENT_TOKEN;
	const repository = process.env.GITHUB_REPOSITORY;
	if (!token || !repository) return null;
	return { token, repository, branch: process.env.GITHUB_BRANCH ?? "main" };
}

function githubHeaders(token: string) {
	return {
		Accept: "application/vnd.github+json",
		Authorization: `Bearer ${token}`,
		"X-GitHub-Api-Version": "2022-11-28",
	};
}

async function readPostSource(slug: string): Promise<string | null> {
	const github = githubSettings();
	if (!github) {
		try {
			return await readFile(path.join(postDirectory, `${slug}.md`), "utf8");
		} catch {
			return null;
		}
	}

	const filePath = `content/posts/${slug}.md`;
	const apiUrl = `https://api.github.com/repos/${github.repository}/contents/${filePath}?ref=${encodeURIComponent(github.branch)}`;
	const response = await fetch(apiUrl, { headers: githubHeaders(github.token), cache: "no-store" });
	if (response.status === 404) return null;
	if (!response.ok) throw new Error("Could not load the post from GitHub.");
	const file = await response.json() as { content?: string; encoding?: string };
	if (!file.content || file.encoding !== "base64") throw new Error("GitHub returned an unsupported post file.");
	return Buffer.from(file.content.replace(/\s/g, ""), "base64").toString("utf8");
}

async function isAuthorized() {
	const sessionToken = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value ?? "";
	return verifyAdminSessionToken(sessionToken);
}

export async function GET(request: Request) {
	if (!await isAuthorized()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const slug = new URL(request.url).searchParams.get("slug");
	try {
		if (slug !== null) {
			if (!slugPattern.test(slug)) return NextResponse.json({ error: "Invalid post slug." }, { status: 400 });
			const source = await readPostSource(slug);
			if (!source) return NextResponse.json({ error: "Post not found." }, { status: 404 });
			const parsed = matter(source);
			return NextResponse.json({
				slug,
				title: parsed.data.title ?? "",
				category: parsed.data.category ?? "Reward Apps",
				date: parsed.data.date ?? "",
				excerpt: parsed.data.excerpt ?? "",
				coverImage: parsed.data.coverImage ?? "",
				primaryCpaUrl: parsed.data.primaryCpaUrl ?? "",
				quickPick: parsed.data.quickPick ?? null,
				tags: Array.isArray(parsed.data.tags) ? parsed.data.tags : [],
				published: parsed.data.published === true,
				content: parsed.content,
			});
		}

		const github = githubSettings();
		if (!github) {
			return NextResponse.json({ posts: listPosts(true).map(({ slug, title }) => ({ slug, title })) });
		}

		const directoryUrl = `https://api.github.com/repos/${github.repository}/contents/content/posts?ref=${encodeURIComponent(github.branch)}`;
		const response = await fetch(directoryUrl, { headers: githubHeaders(github.token), cache: "no-store" });
		if (!response.ok) throw new Error("Could not list posts from GitHub.");
		const files = await response.json() as Array<{ name?: string; type?: string }>;
		const posts = files
			.filter((file) => file.type === "file" && typeof file.name === "string" && file.name.endsWith(".md"))
			.map((file) => {
				const postSlug = file.name!.slice(0, -3);
				return { slug: postSlug, title: postSlug.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) };
			});
		return NextResponse.json({ posts });
	} catch {
		return NextResponse.json({ error: "Could not load existing posts." }, { status: 502 });
	}
}