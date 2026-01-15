import fs from 'fs/promises';
import path from 'path';
import { BlogPostMetadata } from '../types/blog.js';

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

export async function readFile(filePath: string): Promise<string> {
  return await fs.readFile(filePath, 'utf-8');
}

export async function writeFile(filePath: string, content: string): Promise<void> {
  await fs.writeFile(filePath, content, 'utf-8');
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function generateFilename(title: string, date?: string): string {
  const slug = generateSlug(title);
  const datePrefix = date ? date.split('T')[0] : new Date().toISOString().split('T')[0];
  return `${datePrefix}-${slug}.md`;
}

export function generateFrontmatter(metadata: BlogPostMetadata): string {
  const lines: string[] = ['---'];
  
  lines.push(`title: "${metadata.title}"`);
  
  if (metadata.date) {
    lines.push(`date: ${metadata.date}`);
  } else {
    lines.push(`date: ${new Date().toISOString()}`);
  }
  
  if (metadata.author) {
    lines.push(`author: ${metadata.author}`);
  }
  
  if (metadata.tags && metadata.tags.length > 0) {
    lines.push(`tags:`);
    metadata.tags.forEach(tag => {
      lines.push(`  - ${tag}`);
    });
  }
  
  if (metadata.categories && metadata.categories.length > 0) {
    lines.push(`categories:`);
    metadata.categories.forEach(category => {
      lines.push(`  - ${category}`);
    });
  }
  
  if (metadata.draft !== undefined) {
    lines.push(`draft: ${metadata.draft}`);
  } else {
    lines.push(`draft: true`);
  }
  
  lines.push('---');
  lines.push('');
  
  return lines.join('\n');
}

export async function listMarkdownFiles(dirPath: string): Promise<string[]> {
  const files: string[] = [];
  
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(path.join(dirPath, entry.name));
      }
    }
  } catch (error) {
    // Directory doesn't exist or is not accessible
    return [];
  }
  
  return files;
}

export function parseFrontmatter(content: string): { metadata: Record<string, any>; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { metadata: {}, content };
  }
  
  const frontmatter = match[1];
  const body = match[2];
  
  // Simple YAML-like parser for frontmatter
  const metadata: Record<string, any> = {};
  const lines = frontmatter.split('\n');
  
  let currentKey: string | null = null;
  const arrayStack: Array<{ key: string; items: string[] }> = [];
  
  for (const line of lines) {
    if (line.trim().startsWith('#') || line.trim() === '') {
      continue;
    }
    
    if (line.startsWith('  - ') && currentKey) {
      // Array item
      const item = line.trim().substring(2).replace(/^"|"$/g, '').replace(/^'|"$/g, '');
      const currentArray = arrayStack[arrayStack.length - 1];
      if (currentArray) {
        currentArray.items.push(item);
      }
    } else if (line.includes(':')) {
      // Key-value pair
      if (arrayStack.length > 0) {
        // Close previous array
        const completed = arrayStack.pop();
        if (completed) {
          metadata[completed.key] = completed.items;
        }
      }
      
      const [key, ...valueParts] = line.split(':');
      currentKey = key.trim();
      const value = valueParts.join(':').trim();
      
      if (value) {
        // Simple value
        metadata[currentKey] = value.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
      } else {
        // Start of array
        arrayStack.push({ key: currentKey, items: [] });
      }
    }
  }
  
  // Close any remaining array
  if (arrayStack.length > 0) {
    const completed = arrayStack.pop();
    if (completed) {
      metadata[completed.key] = completed.items;
    }
  }
  
  return { metadata, content: body };
}