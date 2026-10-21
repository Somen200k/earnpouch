import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

export type MarkdownArticlePart =
  | { type: "markdown"; content: string }
  | { type: "cpa-widget" };

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

export async function renderMarkdown(markdown: string): Promise<string> {
  const html = await marked.parse(markdown, { gfm: true, breaks: false });
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "h3"]),
    allowedAttributes: { ...sanitizeHtml.defaults.allowedAttributes, a: ["href", "name", "target", "rel"], img: ["src", "alt", "title", "width", "height"] },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: { a: sanitizeHtml.simpleTransform("a", { rel: "nofollow noopener noreferrer", target: "_blank" }, true) },
  });
}