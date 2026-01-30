import dotenv from 'dotenv';
import { Config } from './types/config.js';

// Load .env from current directory
dotenv.config();

export function getConfig(): Config {
  const apiKey = process.env.LLM_API_KEY;
  const endpoint = process.env.LLM_API_ENDPOINT;
  const model = process.env.LLM_MODEL;
  const siteUrl = process.env.OPENROUTER_SITE_URL;
  const siteName = process.env.OPENROUTER_SITE_NAME;

  const githubUrl = process.env.GITHUB_URL;
  const githubOwner = process.env.GITHUB_OWNER;
  const githubRepo = process.env.GITHUB_REPO;
  const githubToken = process.env.GITHUB_TOKEN;
  const githubBranch = process.env.GITHUB_BRANCH || 'main';
  const githubContentPath = process.env.GITHUB_CONTENT_PATH || 'content/posts';

  const author = process.env.BLOG_AUTHOR;

  // Parse GitHub URL to extract owner/repo
  let parsedOwner = githubOwner;
  let parsedRepo = githubRepo;
  let githubApiUrl = githubUrl;

  if (githubUrl) {
    const urlPattern = /https?:\/\/github\.com\/([^\/]+)\/([^\/\.]+)(\.git)?$/;
    const match = githubUrl.match(urlPattern);
    if (match) {
      parsedOwner = match[1];
      parsedRepo = match[2];
      githubApiUrl = githubUrl.replace(/\.git$/, '');
    }
  }

  if (!apiKey || !endpoint || !model) {
    throw new Error(
      'Missing LLM configuration. Please set LLM_API_KEY, LLM_API_ENDPOINT, and LLM_MODEL in your .env file.'
    );
  }

  if ((!githubOwner || !githubRepo) && !githubUrl) {
    throw new Error(
      'Missing GitHub configuration. Please set GITHUB_URL (e.g., https://github.com/owner/repo) or GITHUB_OWNER and GITHUB_REPO in your .env file.'
    );
  }

  if (!githubToken) {
    throw new Error(
      'Missing GitHub token. Please set GITHUB_TOKEN in your .env file.'
    );
  }

  if (!author) {
    throw new Error(
      'Missing author configuration. Please set BLOG_AUTHOR in your .env file.'
    );
  }

  return {
    llm: {
      apiKey,
      endpoint,
      model,
      siteUrl,
      siteName,
    },
    github: {
      owner: parsedOwner!,
      repo: parsedRepo!,
      token: githubToken,
      branch: githubBranch,
      contentPath: githubContentPath,
      url: githubApiUrl,
    },
    author,
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

  if (!process.env.GITHUB_OWNER) {
    errors.push('GITHUB_OWNER is not set in .env');
  }
  if (!process.env.GITHUB_REPO) {
    errors.push('GITHUB_REPO is not set in .env');
  }
  if (!process.env.GITHUB_TOKEN) {
    errors.push('GITHUB_TOKEN is not set in .env');
  }

  if (!process.env.BLOG_AUTHOR) {
    errors.push('BLOG_AUTHOR is not set in .env');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}