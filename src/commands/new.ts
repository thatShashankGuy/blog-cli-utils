import { getConfig } from '../config.js';
import * as fileUtils from '../utils/file.js';
import * as promptUtils from '../utils/prompts.js';
import * as aiUtils from '../utils/ai.js';
import { GitHubAPI } from '../utils/github.js';
import { intro, outro, spinner, note } from '@clack/prompts';
import { BlogPostMetadata } from '../types/blog.js';

export async function newPost(noAi: boolean = false): Promise<void> {
  intro('✨ Creating a new blog post with AI');

  try {
    const config = getConfig();

    if (!config.github.owner || !config.github.repo) {
      outro('❌ GitHub configuration missing. Check GITHUB_URL or GITHUB_OWNER + GITHUB_REPO in .env');
      return;
    }

    const github = new GitHubAPI(config.github);

    // Step 1: Gather metadata
    const title = await promptUtils.promptTitle();
    const isDraft = await promptUtils.promptDraftStatus();

    // Step 2: Open editor for plain text
    const rawText = await promptUtils.openEditorForText();

    let content: string;

    if (noAi) {
      console.log('⚙️  Testing mode: Skipping AI formatting, using raw content...');
      content = rawText;
    } else {
      // Step 3: Generate with AI
      const s = spinner();
      s.start('Generating blog post with AI...');

      try {
        content = await aiUtils.generateBlogPost(config.llm, rawText);
        s.stop('✅ Blog post generated successfully');
      } catch (error) {
        s.stop('❌ Failed to generate post');
        if (error instanceof Error) {
          outro(`Error: ${error.message}`);
        }
        return;
      }

      // Step 4: Show preview
      console.log('\n--- Generated Preview ---\n');
      console.log(content);
      console.log('\n--- End Preview ---\n');
    }

    // Step 5: Confirm
    const confirmed = await promptUtils.promptConfirmation('Do you want to save this post?');
    if (!confirmed) {
      outro('❌ Post creation cancelled');
      return;
    }

    // Step 6: Generate filename and path
    const filename = fileUtils.generateFilename(title);
    const filePath = `${config.github.contentPath}/${filename}`;

    // Step 7: Check if file already exists on GitHub
    const files = await github.listMarkdownFiles();
    const existingFile = files.find(f => f.name === filename);

    if (existingFile) {
      outro(`❌ File already exists on GitHub: ${filename}`);
      note('Choose a different title or use blog-cli list to see existing posts.', 'Tip');
      return;
    }

    // Step 8: Generate metadata
    const date = new Date().toISOString().split('T')[0];
    const metadata: BlogPostMetadata = {
      title,
      author: config.author,
      date,
      draft: isDraft
    };

    // Step 9: Write to GitHub
    const frontmatter = fileUtils.generateFrontmatter(metadata);
    const fullContent = frontmatter + content;

    const spinner2 = spinner();
    spinner2.start('Pushing to GitHub...');
    await github.createFile(filePath, fullContent, `Create post: ${title}`);
    spinner2.stop('✅ Pushed to GitHub');

    outro(`✅ Created new post: ${filename}`);
    outro(`   GitHub: https://github.com/${config.github.owner}/${config.github.repo}/blob/${config.github.branch}/${filePath}`);

  } catch (error) {
    console.error('Error caught:', error);
    console.error('Error type:', typeof error);
    console.error('Is Error:', error instanceof Error);

    if (error instanceof Error) {
      outro(`❌ Error: ${error.message}`);
    } else {
      outro(`❌ An unknown error occurred: ${String(error)}`);
    }
    process.exit(1);
  }
}