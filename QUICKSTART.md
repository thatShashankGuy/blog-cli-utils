# Quick Start Guide

This guide will help you get started with the Blog CLI in just a few minutes.

## Step 1: Install Dependencies

Dependencies are already installed. If you need to reinstall:

```bash
cd blog-cli
bun install
```

## Step 2: Configure Your Environment

The `.env` file has been created in the root directory. Edit it with your credentials:

```bash
code .env
```

### Required Configuration

You MUST configure these three settings:

```env
# LLM Configuration (Required)
LLM_API_KEY=your_actual_api_key_here
LLM_API_ENDPOINT=https://api.openai.com/v1/chat/completions
LLM_MODEL=gpt-4
```

**Note:** You can use any LLM provider (OpenAI, Anthropic, Groq, etc.) - just update the endpoint and model accordingly.

### Optional Configuration

```env
# Git Configuration (Optional - uses global git config if not set)
GIT_AUTHOR_NAME="Shashank Shekhar"
GIT_AUTHOR_EMAIL="your.email@example.com"
GIT_COMMIT_PREFIX="blog:"

# Hugo Configuration (Optional - these are defaults)
HUGO_CONTENT_DIR=content/posts
DEFAULT_EDITOR=code
```

## Step 3: Test the CLI

After configuring your `.env` file, test that everything works:

```bash
cd blog-cli
bun run cli list
```

This should list all your existing blog posts in the `content/posts` directory.

## Step 4: Create Your First Post

### Option A: Standard Mode (Manual Writing)

```bash
bun run cli new
```

Follow the prompts to create a post, then write your content in your editor.

### Option B: AI Mode (Transform Raw Thoughts)

```bash
bun run cli new --ai
```

Paste your rough notes or thoughts, and let AI transform them into a well-structured blog post.

## Step 5: Preview Your Post

```bash
bun run cli preview
```

Open `http://localhost:1313` in your browser to see your post.

Press `Ctrl+C` to stop the preview server.

## Step 6: Publish

1. Edit your post file and set `draft: false` in the frontmatter
2. Run:

```bash
bun run cli publish
```

This will:
- Build your Hugo site
- Commit changes to Git
- Push to GitHub
- Trigger Cloudflare Pages deployment

## Common Commands Reference

```bash
# List all posts
bun run cli list

# List only drafts
bun run cli list --drafts

# List only published posts
bun run cli list --published

# Create a new post (standard)
bun run cli new

# Create a new post with AI
bun run cli new --ai

# Edit a post (select from list)
bun run cli edit

# Edit a specific post
bun run cli edit 2024-01-15-my-post.md

# Preview locally
bun run cli preview

# Preview on custom port
bun run cli preview --port 8080

# Publish to GitHub
bun run cli publish
```

## Troubleshooting

### "Missing LLM configuration" Error

Make sure your `.env` file has these three values:
- `LLM_API_KEY`
- `LLM_API_ENDPOINT`
- `LLM_MODEL`

### "Hugo build failed" Error

Ensure Hugo is installed:
```bash
hugo version
```

### "Git command failed" Error

Make sure you're in a git repository and have proper permissions.

### Can't Use AI Features?

You can still use the CLI without AI! Just use the standard `bun run cli new` command and write manually. The LLM configuration is only required for the `--ai` flag.

## Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Customize the AI prompts in `src/utils/ai.ts`
- Add new commands as needed
- Extend with additional features

## Need Help?

1. Check the [Troubleshooting section](./README.md#troubleshooting) in the main README
2. Review your `.env` configuration
3. Ensure all prerequisites are installed
4. Check your LLM provider's API documentation

Happy blogging! 🚀