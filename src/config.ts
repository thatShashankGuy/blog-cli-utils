import dotenv from 'dotenv';
import path from 'path';
import { Config } from './types/config.js';

// Load .env from the parent directory (root of Hugo project)
const envPath = path.join(process.cwd(), '.env');
dotenv.config({ path: envPath });

export function getConfig(): Config {
  const apiKey = process.env.LLM_API_KEY;
  const endpoint = process.env.LLM_API_ENDPOINT;
  const model = process.env.LLM_MODEL;
  const authorName = process.env.GIT_AUTHOR_NAME;
  const authorEmail = process.env.GIT_AUTHOR_EMAIL;
  const commitPrefix = process.env.GIT_COMMIT_PREFIX || 'blog:';
  const contentDir = process.env.HUGO_CONTENT_DIR || 'content/posts';
  const defaultEditor = process.env.DEFAULT_EDITOR || 'code';

  if (!apiKey || !endpoint || !model) {
    throw new Error(
      'Missing LLM configuration. Please set LLM_API_KEY, LLM_API_ENDPOINT, and LLM_MODEL in your .env file.'
    );
  }

  return {
    llm: {
      apiKey,
      endpoint,
      model,
    },
    git: {
      authorName: authorName || '',
      authorEmail: authorEmail || '',
      commitPrefix,
    },
    hugo: {
      contentDir,
      defaultEditor,
    },
  };
}

export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!process.env.LLM_API_KEY) {
    errors.push('LLM_API_KEY is not set in .env');
  }
  if (!process.env.LLM_API_ENDPOINT) {
    errors.push('LLM_API_ENDPOINT is not set in .env');
  }
  if (!process.env.LLM_MODEL) {
    errors.push('LLM_MODEL is not set in .env');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}