# Blog CLI

A simple CLI tool for managing blog posts with AI assistance. Create and list posts directly on GitHub using any LLM provider.

## Features

- ✨ **AI-Powered Writing** - Transform plain text into well-structured blog posts
- 📝 **Post Management** - List drafts and published posts from GitHub
- 🚀 **Direct GitHub Integration** - No local file management needed
- 🎨 **Provider Agnostic** - Works with any LLM provider (OpenAI, OpenRouter, etc.)
- 🔒 **Secure** - No hardcoded credentials, environment-based configuration

## Prerequisites

- [Bun](https://bun.sh/) - Fast JavaScript runtime
- GitHub account with a blog repository
- GitHub Personal Access Token
- LLM API access (optional, for AI features)
- Text editor (configured via `$EDITOR` environment variable)

## Installation

1. Clone your blog repository
2. Navigate to the `blog-cli` directory
3. Install dependencies:

```bash
bun install
```

4. Link globally (optional):

```bash
bun run build
bun link
```

After linking, you can use `blog-cli` from anywhere.

## Configuration

### 1. Set Up Environment Variables

Create a `.env` file in your current directory:

```env
# LLM Configuration (required)
LLM_API_KEY=your_api_key_here
LLM_API_ENDPOINT=https://api.your-provider.com/v1/chat/completions
LLM_MODEL=your-model-name

# Optional: For OpenRouter rankings
OPENROUTER_SITE_URL=https://yourblog.com
OPENROUTER_SITE_NAME=Your Blog Name

# GitHub Configuration (required)
# Option 1: Use full GitHub URL
GITHUB_URL=https://github.com/your-github-username/your-hugo-blog-repo.git

# Option 2: Use separate values (if GITHUB_URL is not set)
# GITHUB_OWNER=your-github-username
# GITHUB_REPO=your-hugo-blog-repo

GITHUB_TOKEN=ghp_your_personal_access_token
GITHUB_BRANCH=main
GITHUB_CONTENT_PATH=content/posts

# Author (required)
BLOG_AUTHOR="Your Name"
```

### 2. GitHub Token Setup

Create a GitHub Personal Access Token:

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Select scope:
   - `repo` for private repositories
   - `public_repo` for public repositories
4. Copy the token and set it as `GITHUB_TOKEN` in your `.env` file

### 3. Editor Setup

Set your preferred text editor:

```bash
export EDITOR=code          # VS Code
export EDITOR=vim           # Vim
export EDITOR=nano          # Nano
```

Add to `~/.bashrc` or `~/.zshrc` for persistence.

### 4. LLM Provider Setup

The tool works with any LLM provider that has an OpenAI-compatible API.

#### OpenRouter
```env
LLM_API_KEY=sk-or-...
LLM_API_ENDPOINT=https://openrouter.ai/api/v1/chat/completions
LLM_MODEL=openai/gpt-4
```

#### OpenAI
```env
LLM_API_KEY=sk-...
LLM_API_ENDPOINT=https://api.openai.com/v1/chat/completions
LLM_MODEL=gpt-4
```

#### Other Providers
Any provider with an OpenAI-compatible endpoint will work. Just update `LLM_API_ENDPOINT` and `LLM_MODEL` accordingly.

## Usage

### Create a New Post with AI

Transform your plain text into a well-structured blog post:

```bash
blog-cli new --ai
```

The wizard will:
1. Prompt for title
2. Prompt for draft status (default: published)
3. Open your editor for plain text input
4. Send plain text to AI for formatting
5. Show you a preview
6. Upload to GitHub with metadata

**Metadata Format:**
```yaml
---
title: "Your Post Title"
author: "Your Name"
date: 2026-01-31
draft: false
---

[AI-formatted markdown content]
```

**Filename:** Based on title (e.g., `this-article-is-cool.md`)

### List All Posts

View all your blog posts with their status from GitHub:

```bash
blog-cli list
```

Filter by status:

```bash
# Show only draft posts
blog-cli list --drafts

# Show only published posts
blog-cli list --published
```

### Setup Help

Display comprehensive setup and usage guide:

```bash
blog-cli help
```

or

```bash
blog-cli --help
```

## Workflow Example

### Typical Blog Post Workflow

1. **Create with AI**:
   ```bash
   blog-cli new --ai
   ```

2. **Write in Editor**:
   - Write your thoughts in plain text
   - Don't worry about formatting
   - Include all key points

3. **Preview and Confirm**:
   - AI will format your text
   - Review the preview
   - Confirm to upload

4. **Uploaded to GitHub**:
   - File saved as `title.md`
   - Metadata added automatically
   - Ready for your site to process

## Project Structure

```
blog-cli/
├── src/
│   ├── commands/          # CLI command implementations
│   │   ├── new.ts      # Create posts with AI
│   │   └── list.ts     # List posts from GitHub
│   ├── utils/             # Utility functions
│   │   ├── file.ts     # File operations (slug, frontmatter)
│   │   ├── github.ts   # GitHub API wrapper
│   │   ├── ai.ts       # LLM API calls
│   │   └── prompts.ts  # Interactive prompts + editor
│   ├── types/             # TypeScript type definitions
│   │   ├── blog.ts
│   │   ├── ai.ts
│   │   ├── config.ts
│   │   └── github.ts
│   ├── config.ts          # Configuration management
│   └── index.ts          # CLI entry point
├── .env.example          # Environment template
├── package.json
├── README.md
└── tsconfig.json
```

## Troubleshooting

### "EDITOR environment variable is not set"

Set your editor in your shell configuration:

```bash
export EDITOR=code
```

Add to `~/.bashrc` or `~/.zshrc` for persistence.

### "Missing LLM configuration"

Ensure your `.env` file has:
- `LLM_API_KEY`
- `LLM_API_ENDPOINT`
- `LLM_MODEL`

### "Missing GitHub configuration"

Ensure your `.env` file has either:
- `GITHUB_URL` (e.g., `https://github.com/username/repo.git`)
- **OR** `GITHUB_OWNER` and `GITHUB_REPO`
- `GITHUB_TOKEN`

### "File already exists on GitHub"

Choose a different title for your post, or check `blog-cli list` to see existing posts.

### AI Generation Issues

- Check your API key is valid
- Verify the API endpoint is correct
- Ensure you have API credits/quota available
- Try with shorter text if the request is too large

## Security

- **Never commit** the `.env` file - it should be in `.gitignore`
- Keep your API keys secure
- Use environment-specific keys when possible
- Rotate API keys regularly

## License

This tool is part of your blog project. Modify and use as needed.

## Support

For issues or questions:
1. Run `blog-cli help` for setup guide
2. Review the `.env.example` file
3. Ensure all prerequisites are installed
4. Check your API provider's documentation