import { select, text, confirm, multiselect } from '@clack/prompts';

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

export async function promptTags(): Promise<string[]> {
  const useTags = await confirm({
    message: 'Would you like to add tags?',
    initialValue: false
  });

  if (!useTags) return [];

  const tags = await text({
    message: 'Enter tags (comma-separated):',
    placeholder: 'typescript, programming, tutorial'
  });

  if (typeof tags !== 'string' || !tags.trim()) return [];

  return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
}

export async function promptCategories(): Promise<string[]> {
  const useCategories = await confirm({
    message: 'Would you like to add categories?',
    initialValue: false
  });

  if (!useCategories) return [];

  const categories = await text({
    message: 'Enter categories (comma-separated):',
    placeholder: 'Programming, Web Development'
  });

  if (typeof categories !== 'string' || !categories.trim()) return [];

  return categories.split(',').map(cat => cat.trim()).filter(cat => cat.length > 0);
}

export async function promptAuthor(defaultAuthor?: string): Promise<string | undefined> {
  const useAuthor = await confirm({
    message: 'Would you like to set an author?',
    initialValue: !!defaultAuthor
  });

  if (!useAuthor) return undefined;

  const author = await text({
    message: 'Enter author name:',
    placeholder: defaultAuthor || 'John Doe',
    defaultValue: defaultAuthor
  });

  if (typeof author !== 'string') return undefined;

  return author.trim();
}

export async function promptRawText(): Promise<string> {
  const rawText = await text({
    message: 'Enter your raw thoughts (press Enter when done):',
    placeholder: 'Type or paste your thoughts here...',
    validate: (value) => {
      if (!value || value.trim().length === 0) {
        return 'Raw text is required for AI generation';
      }
      return undefined;
    }
  });

  if (typeof rawText !== 'string') {
    throw new Error('Raw text is required');
  }

  return rawText;
}

export async function promptConfirmation(message: string): Promise<boolean> {
  const confirmed = await confirm({
    message,
    initialValue: true
  });

  return confirmed === true;
}

export async function promptFileSelection(files: Array<{ name: string; value: string }>): Promise<string> {
  const selected = await select({
    message: 'Select a file:',
    options: files
  });

  if (typeof selected !== 'string') {
    throw new Error('File selection is required');
  }

  return selected;
}