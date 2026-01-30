import { BlogPostMetadata } from "../types/blog.js";

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function generateFilename(title: string): string {
  const slug = generateSlug(title);
  return `${slug}.md`;
}

export function generateFrontmatter(metadata: BlogPostMetadata): string {
  const lines: string[] = ["---"];

  lines.push(`title: "${metadata.title}"`);
  lines.push(`author: ${metadata.author}`);
  lines.push(`date: ${metadata.date}`);
  lines.push(`draft: ${metadata.draft}`);

  lines.push("---");
  lines.push("");

  return lines.join("\n");
}

export function parseFrontmatter(content: string): {
  metadata: Record<string, any>;
  content: string;
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { metadata: {}, content };
  }

  const frontmatter = match[1];
  const body = match[2];

  const metadata: Record<string, any> = {};
  const lines = frontmatter.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const colonIndex = trimmed.indexOf(":");
    if (colonIndex === -1) {
      continue;
    }

    const key = trimmed.substring(0, colonIndex).trim();
    const value = trimmed.substring(colonIndex + 1).trim();

    if (value.startsWith('"') && value.endsWith('"')) {
      metadata[key] = value.slice(1, -1);
    } else if (value === "true") {
      metadata[key] = true;
    } else if (value === "false") {
      metadata[key] = false;
    } else {
      metadata[key] = value;
    }
  }

  return { metadata, content: body };
}