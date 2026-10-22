import { marked } from "marked";
import type { Tokens } from "marked";
import sanitizeHtml from "sanitize-html";

export type MarkdownArticlePart =
  | { type: "markdown"; content: string }
  | { type: "cpa-widget" };
export type ArticleHeading = { id: string; title: string; depth: number; partIndex: number };

export function splitCpaWidgetShortcode(markdown: string): MarkdownArticlePart[] {
  const parts: MarkdownArticlePart[] = [];
  let lines: string[] = [];
  let codeFence: { character: string; length: number } | undefined;

  const flushMarkdown = () => {
    const content = lines.join("\n");
    if (content.trim()) parts.push({ type: "markdown", content });
    lines = [];
  };

  for (const line of markdown.split(/\r?\n/)) {
    const fence = line.match(/^\s*(`{3,}|~{3,})/);
    if (fence) {
      if (!codeFence) {
        codeFence = { character: fence[1][0], length: fence[1].length };
      } else if (fence[1][0] === codeFence.character && fence[1].length >= codeFence.length) {
        codeFence = undefined;
      }
      lines.push(line);
    } else if (!codeFence && line.trim() === "[CPA_WIDGET]") {
      flushMarkdown();
      parts.push({ type: "cpa-widget" });
    } else {
      lines.push(line);
    }
  }

  flushMarkdown();
  return parts;
}

function createHeadingId(text: string, usedIds: Map<string, number>): string {
  const base = text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "section";
  const count = usedIds.get(base) ?? 0;
  usedIds.set(base, count + 1);
  return count === 0 ? base : `${base}-${count}`;
}

export function getArticleHeadings(parts: MarkdownArticlePart[]): ArticleHeading[] {
  const usedIds = new Map<string, number>();
  return parts.flatMap((part, partIndex) => {
    if (part.type !== "markdown") return [];
    return marked.lexer(part.content)
      .filter((token): token is Tokens.Heading => token.type === "heading")
      .map((heading) => ({
        id: createHeadingId(heading.text, usedIds),
        title: heading.text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[`*_~]/g, ""),
        depth: heading.depth,
        partIndex,
      }));
  });
}

export async function renderMarkdown(markdown: string, headingIds: string[] = []): Promise<string> {
  const renderer = new marked.Renderer();
  let headingIndex = 0;
  renderer.heading = function ({ tokens, depth }: Tokens.Heading) {
    const id = headingIds[headingIndex++];
    const content = this.parser.parseInline(tokens);
    return id
      ? `<h${depth} id="${id}">${content}</h${depth}>\n`
      : `<h${depth}>${content}</h${depth}>\n`;
  };
  const html = await marked.parse(markdown, { gfm: true, breaks: false, renderer });
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "h3"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ["href", "name", "target", "rel"],
      h1: ["id"],
      h2: ["id"],
      h3: ["id"],
      img: ["src", "alt", "title", "width", "height"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: { a: sanitizeHtml.simpleTransform("a", { rel: "nofollow noopener noreferrer", target: "_blank" }, true) },
  });
}