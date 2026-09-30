import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

export async function renderMarkdown(markdown: string): Promise<string> {
  const html = await marked.parse(markdown, { gfm: true, breaks: false });
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "h3"]),
    allowedAttributes: { ...sanitizeHtml.defaults.allowedAttributes, a: ["href", "name", "target", "rel"], img: ["src", "alt", "title", "width", "height"] },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: { a: sanitizeHtml.simpleTransform("a", { rel: "nofollow noopener noreferrer", target: "_blank" }, true) },
  });
}