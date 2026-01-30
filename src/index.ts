#!/usr/bin/env bun
import { Command } from 'commander';
import { validateConfig } from './config.js';
import { newPost } from './commands/new.js';
import { listPosts } from './commands/list.js';

const program = new Command();

program
  .name('blog-cli')
  .description('Simple CLI tool for managing blog posts with AI assistance')
  .version('1.0.0');

program
  .command('new')
  .description('Create a new blog post using AI')
  .option('--ai', 'Use AI to format your plain text (default mode)')
  .action(async (options) => {
    if (!options.ai) {
      console.log('⚠️  --ai is required. Creating posts without AI is not supported.');
      console.log('   Usage: blog-cli new --ai');
      console.log('   Or run: blog-cli --help for setup instructions');
      process.exit(1);
    }
    await newPost();
  });

program
  .command('list')
  .description('List all blog posts')
  .option('--drafts', 'Show only draft posts')
  .option('--published', 'Show only published posts')
  .action(async (options) => {
    let filter: boolean | null = null;
    if (options.drafts) filter = true;
    if (options.published) filter = false;
    await listPosts(filter);
  });

program
  .command('help')
  .description('Show setup and usage guide')
  .action(() => {
    showSetupGuide();
  });

program.option('--help', 'Show setup and usage guide')
  .action(() => {
    showSetupGuide();
  });

// Validate config before running commands (except help)
if (process.argv.length > 2 && !process.argv.includes('--help') && !process.argv.includes('help')) {
  const validation = validateConfig();
  if (!validation.valid) {
    console.error('❌ Configuration error:');
    validation.errors.forEach(error => {
      console.error(`  - ${error}`);
    });
    console.error('\nPlease set up your .env file. Run: blog-cli help');
    process.exit(1);
  }
}

program.parse(process.argv);

function showSetupGuide() {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    Blog CLI Setup & Usage Guide                     ║
╚══════════════════════════════════════════════════════════════╝

📋 PREREQUISITES
───────────────────────────────────────────────────────────────────────
  1. GitHub account with a blog repository
  2. GitHub Personal Access Token
  3. LLM API access (OpenRouter, OpenAI, etc.)
  4. Text editor (set via EDITOR environment variable)

 ⚙️  CONFIGURATION
 ───────────────────────────────────────────────────────────────────────
 1. Create a .env file in your current directory:
 
    LLM_API_KEY=your_api_key_here
    LLM_API_ENDPOINT=https://api.openrouter.ai/api/v1/chat/completions
    LLM_MODEL=openai/gpt-4
 
    # Option 1: Use full GitHub URL
    GITHUB_URL=https://github.com/username/repo.git
 
    # Option 2: Use separate values (if GITHUB_URL not set)
    # GITHUB_OWNER=your-github-username
    # GITHUB_REPO=your-blog-repo
 
    GITHUB_TOKEN=ghp_your_personal_access_token
    GITHUB_BRANCH=main
    GITHUB_CONTENT_PATH=content/posts
 
    BLOG_AUTHOR="Your Name"

2. Get GitHub Personal Access Token:
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Select scope: repo (for private) or public_repo (for public)
   - Copy token and set as GITHUB_TOKEN

3. Set your editor:
   export EDITOR=code    # VS Code
   export EDITOR=vim     # Vim
   export EDITOR=nano    # Nano

📝 USAGE
───────────────────────────────────────────────────────────────────────

Create a new post:
  blog-cli new --ai

  This will:
  1. Prompt for title
  2. Prompt for draft status (default: published)
  3. Open your editor for plain text input
  4. Format text with AI
  5. Upload to GitHub

List all posts:
  blog-cli list                    # Show all posts
  blog-cli list --drafts          # Show only drafts
  blog-cli list --published       # Show only published

💡 TIPS
───────────────────────────────────────────────────────────────────────
• Write naturally in the editor, no formatting needed
• AI will add headings and improve structure
• Draft posts won't be visible on your live site
• Set draft: true to keep posts private until ready
• Duplicate filenames will cause an error

❓ TROUBLESHOOTING
───────────────────────────────────────────────────────────────────────

"EDITOR environment variable is not set"
  → Set it in your shell: export EDITOR=code
  → Add to ~/.bashrc or ~/.zshrc for persistence

"Missing LLM configuration"
  → Check .env has LLM_API_KEY, LLM_API_ENDPOINT, LLM_MODEL

 "Missing GitHub configuration"
   → Check .env has either GITHUB_URL or GITHUB_OWNER + GITHUB_REPO
   → GITHUB_URL format: https://github.com/username/repo.git

"File already exists on GitHub"
  → Choose a different title for your post

🔗 RESOURCES
───────────────────────────────────────────────────────────────────────
• GitHub Tokens:  https://github.com/settings/tokens
• OpenRouter:       https://openrouter.ai/
• Bun Documentation: https://bun.sh/docs

══════════════════════════════════════════════════════════════
`);
}
