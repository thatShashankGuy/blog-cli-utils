import path from 'path';
import { getConfig } from '../config.js';
import * as fileUtils from '../utils/file.js';
import * as promptUtils from '../utils/prompts.js';
import * as aiUtils from '../utils/ai.js';
import { intro, outro, spinner, note } from '@clack/prompts';
import { BlogPostMetadata } from '../types/blog.js';
import { execSync } from 'child_process';

export async function newPost(aiMode: boolean = false): Promise<void> {
  intro('✨ Creating a new blog post');

  try {
    const config = getConfig();

    // Gather metadata
    const title = await promptUtils.promptTitle();
    const tags = await promptUtils.promptTags();
    const categories = await promptUtils.promptCategories();
    const author = await promptUtils.promptAuthor(config.git.authorName);

    let content = '';

    if (aiMode) {
      // AI mode: generate content from raw thoughts
      const rawText = await promptUtils.promptRawText();
      
      const s = spinner();
      s.start('Generating blog post with AI...');
      
      try {
        content = await aiUtils.generateBlogPost(config.llm, rawText);
        s.stop('✅ Blog post generated successfully');
        
        // Show preview
        console.log('\n--- Generated Preview ---\n');
        console.log(content);
        console.log('\n--- End Preview ---\n');
        
        const confirmed = await promptUtils.promptConfirmation('Do you want to save this post?');
        if (!confirmed) {
          outro('❌ Post creation cancelled');
          return;
        }
      } catch (error) {
        s.stop('❌ Failed to generate post');
        if (error instanceof Error) {
          outro(`Error: ${error.message}`);
        }
        return;
      }
    } else {
      // Standard mode: empty content
      content = '';
      note('You can edit the content after the file is created', 'Tip');
    }

    // Generate metadata
    const metadata: BlogPostMetadata = {
      title,
      tags: tags.length > 0 ? tags : undefined,
      categories: categories.length > 0 ? categories : undefined,
      author,
      draft: true
    };

    // Generate filename and path
    const filename = fileUtils.generateFilename(title);
    const contentDir = config.hugo.contentDir;
    const filePath = path.join(contentDir, filename);

    // Check if file already exists
    if (await fileUtils.fileExists(filePath)) {
      outro(`❌ File already exists: ${filename}`);
      return;
    }

    // Ensure directory exists
    await fileUtils.ensureDir(path.dirname(filePath));

    // Write file
    const frontmatter = fileUtils.generateFrontmatter(metadata);
    const fullContent = frontmatter + content;
    await fileUtils.writeFile(filePath, fullContent);

    outro(`✅ Created new post: ${filename}`);

    // Offer to open in editor
    const confirmed = await promptUtils.promptConfirmation('Would you like to open the file in your editor?');
    if (confirmed) {
      try {
        const editor = config.hugo.defaultEditor;
        execSync(`${editor} "${filePath}"`, { stdio: 'inherit' });
      } catch (error) {
        console.log(`\nFailed to open editor. File location: ${filePath}`);
      }
    }

  } catch (error) {
    if (error instanceof Error) {
      outro(`❌ Error: ${error.message}`);
    } else {
      outro('❌ An unknown error occurred');
    }
    process.exit(1);
  }
}