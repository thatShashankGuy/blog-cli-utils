# Blog CLI

I build this tool  to automate  my blog writing using terminal.
Built with Bun and TypeScript. All AI generated boilerplate code and documentation is reviewed and project is WIP. 

## Features

- ✨ **Easy Post Creation** - Create new blog posts with interactive prompts
- 🤖 **AI-Powered Writing** - Transform raw thoughts into well-structured blog posts using any LLM
- 📝 **Post Management** - List, edit, and organize your blog posts
- 🚀 **Local Preview** - Start Hugo development server with one command
- 📤 **Automated Publishing** - Build, commit, and push to GitHub effortlessly
- 🔒 **Secure** - No hardcoded credentials, environment-based configuration
- 🎨 **Provider Agnostic** - Works with any LLM provider (OpenAI-compatible endpoints)

## Prerequisites

- [Bun](https://bun.sh/) - Fast JavaScript runtime
- [Hugo](https://gohugo.io/) - Static site generator
- Git
- An LLM provider with API access (optional, for AI features)

## Installation

1. Clone your blog repository
2. Navigate to the `blog-cli` directory
3. Install dependencies:

```bash
bun install
```

4. (Optional) Link globally to use `blog-cli` command from anywhere:

```bash
bun run build
bun link
```

After linking, you can use `blog-cli` instead of `bun run cli`:

```bash
# Without linking
bun run cli list

# After linking
blog-cli list
```

## Configuration

### 1. Set Up Environment Variables

Copy the example environment file to the root of your Hugo project:

```bash
cp blog-cli/.env.example .env
```

Edit the `.env` file with your configuration:

```env
# LLM Configuration
LLM_API_KEY=your_api_key_here
LLM_API_ENDPOINT=https://api.your-provider.com/v1/chat/completions
LLM_MODEL=your-model-name

# Optional: For OpenRouter (helps with rankings)
OPENROUTER_SITE_URL=https://yourblog.com
OPENROUTER_SITE_NAME=Your Blog Name

# Git Configuration
GIT_AUTHOR_NAME="Your Name"
GIT_AUTHOR_EMAIL="your.email@example.com"
GIT_COMMIT_PREFIX="blog:"

# Hugo Configuration
HUGO_CONTENT_DIR=content/posts
DEFAULT_EDITOR=code
```

### 2. LLM Provider Setup

The tool works with any LLM provider that has an OpenAI-compatible API. Here are some popular options:

#### OpenAI
```env
LLM_API_KEY=sk-...
LLM_API_ENDPOINT=https://api.openai.com/v1/chat/completions
LLM_MODEL=gpt-4
```

#### Anthropic (Claude)
```env
LLM_API_KEY=sk-ant-...
LLM_API_ENDPOINT=https://api.anthropic.com/v1/messages
LLM_MODEL=claude-3-sonnet-20240229
```

#### OpenRouter
```env
LLM_API_KEY=sk-or-...
LLM_API_ENDPOINT=https://openrouter.ai/api/v1/chat/completions
LLM_MODEL=openai/gpt-4

# Optional: For OpenRouter rankings (recommended)
OPENROUTER_SITE_URL=https://yourblog.com
OPENROUTER_SITE_NAME=Your Blog Name
```

#### Other Providers
Any provider with an OpenAI-compatible endpoint will work. Just update the `LLM_API_ENDPOINT` and `LLM_MODEL` accordingly.

### 3. Git Configuration (Optional)

If you want the CLI to set git author information automatically, configure it in `.env`:

```env
GIT_AUTHOR_NAME="Shashank Shekhar"
GIT_AUTHOR_EMAIL="your.email@example.com"
```

Otherwise, it will use your global git configuration.

### 4. Editor Configuration

Set your preferred text editor:

```env
DEFAULT_EDITOR=code          # VS Code
DEFAULT_EDITOR=vim           # Vim
DEFAULT_EDITOR=nano          # Nano
DEFAULT_EDITOR=subl          # Sublime Text
```

## Usage

### Create a New Post (Standard Mode)

Create a new blog post with manual content writing:

```bash
bun run cli new
```

You'll be prompted for:
- Post title
- Tags (optional)
- Categories (optional)
- Author (optional)

The post will be created as a draft (`draft: true`) and opened in your editor.

### Create a New Post with AI

Let AI transform your raw thoughts into a well-structured blog post:

```bash
bun run cli new --ai
```

You'll be prompted for:
- Post title
- Tags (optional)
- Categories (optional)
- Author (optional)
- Raw thoughts (paste your unstructured text here)

The AI will:
1. Process your raw thoughts
2. Improve grammar and sentence structure
3. Add appropriate headings
4. Preserve your writing style
5. Show you a preview for confirmation
6. Save if you approve

### List All Posts

View all your blog posts with their status:

```bash
bun run cli list
```

Filter by status:

```bash
# Show only draft posts
bun run cli list --drafts

# Show only published posts
bun run cli list --published
```

### Edit a Post

Open a post in your editor:

```bash
# Select from a list
bun run cli edit

# Edit specific file
bun run cli edit 2024-01-15-my-post.md
```

### Preview Locally

Start the Hugo development server to preview your site:

```bash
bun run cli preview
```

The server will run on `http://localhost:1313` by default.

Custom port:

```bash
bun run cli preview --port 8080
```

Press `Ctrl+C` to stop the server.

### Publish to GitHub

Build your Hugo site, commit changes, and push to GitHub:

```bash
bun run cli publish
```

The tool will:
1. Check for draft posts and warn you
2. Show changed files
3. Ask for confirmation
4. Build the Hugo site
5. Commit changes with a meaningful message
6. Push to GitHub

Your Cloudflare Pages integration will automatically deploy the changes.

## Workflow Example

### Typical Blog Post Workflow

1. **Create with AI**:
   ```bash
   bun run cli new --ai
   ```

2. **Preview locally**:
   ```bash
   bun run cli preview
   ```
   Open `http://localhost:1313` in your browser.

3. **Edit as needed**:
   ```bash
   bun run cli edit 2024-01-15-my-post.md
   ```

4. **Set draft to false** in the frontmatter when ready:
   ```yaml
   ---
   title: "My Post"
   draft: false
   ---
   ```

5. **Publish**:
   ```bash
   bun run cli publish
   ```

### Manual Writing Workflow

1. **Create post**:
   ```bash
   bun run cli new
   ```

2. **Write content** in your editor

3. **Preview** and **edit** as needed

4. **Publish** when ready

## Project Structure

```
blog-cli/
├── src/
│   ├── commands/          # CLI command implementations
│   │   ├── new.ts
│   │   ├── list.ts
│   │   ├── edit.ts
│   │   ├── preview.ts
│   │   └── publish.ts
│   ├── utils/             # Utility functions
│   │   ├── file.ts        # File operations
│   │   ├── git.ts         # Git operations
│   │   ├── hugo.ts        # Hugo commands
│   │   ├── ai.ts          # LLM API calls
│   │   └── prompts.ts     # Interactive prompts
│   ├── types/             # TypeScript type definitions
│   │   ├── blog.ts
│   │   ├── ai.ts
│   │   └── config.ts
│   ├── config.ts          # Configuration management
│   └── index.ts          # CLI entry point
├── .env.example          # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## Troubleshooting

### "Missing LLM configuration" Error

Make sure your `.env` file has the required fields:
```env
LLM_API_KEY=...
LLM_API_ENDPOINT=...
LLM_MODEL=...
```

### "Hugo build failed" Error

Ensure Hugo is installed and in your PATH:
```bash
hugo version
```

### "Git command failed" Error

Make sure you're in a git repository and have the necessary permissions.

### AI Generation Issues

- Check your API key is valid
- Verify the API endpoint is correct
- Ensure you have API credits/quota available
- Try with shorter raw text if the request is too large

## Security

- **Never commit** the `.env` file - it's already in `.gitignore`
- Keep your API keys secure
- Use environment-specific keys when possible
- Rotate API keys regularly

## Contributing

Feel free to extend the CLI with new features. The modular structure makes it easy to add:

- New commands
- Additional LLM providers
- Enhanced post templates
- Custom workflows
- Content validation
- SEO optimization tools

## License

This tool is part of your blog project. Modify and use as needed.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the `.env.example` file
3. Ensure all prerequisites are installed
4. Check your API provider's documentation

## Future Enhancements

Potential features to add:
- [ ] Image management and optimization
- [ ] SEO meta tag generation
- [ ] Scheduled publishing
- [ ] Post templates
- [ ] Content backup
- [ ] Multi-language support
- [ ] Import from other platforms
- [ ] Analytics integration
