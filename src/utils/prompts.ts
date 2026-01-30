import { text, confirm } from '@clack/prompts';
import { execSync } from 'child_process';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';

export async function promptTitle(): Promise<string> {
  const title = await text({
    message: 'Enter blog post title:',
    validate: (value) => {
      if (!value || value.trim().length === 0) {
        return 'Title is required';
      }
      return undefined;
    }
  });

  if (typeof title !== 'string') {
    throw new Error('Title is required');
  }

  return title;
}

export async function promptDraftStatus(): Promise<boolean> {
  const isDraft = await confirm({
    message: 'Set as draft?',
    initialValue: false
  });

  if (typeof isDraft !== 'boolean') {
    throw new Error('Draft status is required');
  }

  return isDraft;
}

export async function promptConfirmation(message: string): Promise<boolean> {
  const confirmed = await confirm({
    message,
    initialValue: true
  });

  if (typeof confirmed !== 'boolean') {
    throw new Error('Operation cancelled');
  }

  return confirmed === true;
}

export async function openEditorForText(): Promise<string> {
  const editor = process.env.EDITOR;

  if (!editor) {
    throw new Error(
      'EDITOR environment variable is not set. ' +
      'Please set it in your shell configuration (e.g., export EDITOR=code) ' +
      'or run: blog-cli --help for setup instructions.'
    );
  }

  const tempDir = os.tmpdir();
  const tempFilePath = path.join(tempDir, `blog-post-${Date.now()}.md`);

  const instructions = `# Blog Post Raw Content

Write your blog post content here in plain text. This will be formatted by AI later.

Tips:
- Write naturally, don't worry about formatting
- Include all your key points and ideas
- Use paragraphs to separate main thoughts
- The AI will add headings, improve structure, and enhance readability

---
Remove this header section and start writing below:
`;

  await fs.writeFile(tempFilePath, instructions, 'utf-8');

  try {
    execSync(`${editor} "${tempFilePath}"`, { stdio: 'inherit' });
  } catch (error) {
    await fs.unlink(tempFilePath);
    throw new Error(`Editor failed to open: ${editor}`);
  }

  const content = await fs.readFile(tempFilePath, 'utf-8');

  await fs.unlink(tempFilePath);

  const cleanedContent = content
    .replace(/# Blog Post Raw Content[\s\S]*?---\n?/, '')
    .trim();

  if (!cleanedContent || cleanedContent.length === 0) {
    throw new Error('No content written. Please write some content in the editor.');
  }

  return cleanedContent;
}