#!/usr/bin/env bun
import { Command } from 'commander';
import { validateConfig } from './config.js';
import { newPost } from './commands/new.js';
import { listPosts } from './commands/list.js';
import { editPost } from './commands/edit.js';
import { previewServer } from './commands/preview.js';
import { publishPosts } from './commands/publish.js';

const program = new Command();

program
  .name('blog-cli')
  .description('CLI tool for Hugo blog automation with AI support')
  .version('1.0.0');

program
  .command('new')
  .description('Create a new blog post')
  .option('--ai', 'Use AI to generate content from raw thoughts')
  .action(async (options) => {
    await newPost(options.ai || false);
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
  .command('edit')
  .description('Edit a blog post')
  .argument('[filename]', 'Filename of the post to edit')
  .action(async (filename) => {
    await editPost(filename);
  });

program
  .command('preview')
  .description('Start Hugo development server for preview')
  .option('-p, --port <port>', 'Port to run the server on', '1313')
  .action(async (options) => {
    const port = parseInt(options.port, 10);
    await previewServer(port);
  });

program
  .command('publish')
  .description('Build, commit, and push changes to GitHub')
  .action(async () => {
    await publishPosts();
  });

// Validate config before running commands
if (process.argv.length > 2) {
  const validation = validateConfig();
  if (!validation.valid) {
    console.error('❌ Configuration error:');
    validation.errors.forEach(error => {
      console.error(`  - ${error}`);
    });
    console.error('\nPlease set up your .env file. Copy blog-cli/.env.example to .env and configure it.');
    process.exit(1);
  }
}

program.parse(process.argv);