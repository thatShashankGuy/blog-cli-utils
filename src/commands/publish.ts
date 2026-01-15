import path from 'path';
import { getConfig } from '../config.js';
import * as fileUtils from '../utils/file.js';
import * as gitUtils from '../utils/git.js';
import { buildHugo } from '../utils/hugo.js';
import * as promptUtils from '../utils/prompts.js';
import { intro, outro, spinner, log, confirm } from '@clack/prompts';

export async function publishPosts(): Promise<void> {
  intro('🚀 Publishing to GitHub');

  try {
    const config = getConfig();
    const contentDir = config.hugo.contentDir;
    const postsPath = path.join(process.cwd(), contentDir);

    // Check for drafts
    const files = await fileUtils.listMarkdownFiles(postsPath);
    const draftPosts: Array<{ filename: string; title: string }> = [];

    for (const file of files) {
      try {
        const content = await fileUtils.readFile(file);
        const { metadata } = fileUtils.parseFrontmatter(content);
        
        if (metadata.draft !== false) {
          draftPosts.push({
            filename: path.basename(file),
            title: metadata.title || 'Untitled'
          });
        }
      } catch (error) {
        // Skip files that can't be parsed
      }
    }

    // Warn about drafts
    if (draftPosts.length > 0) {
      log.warn(`Found ${draftPosts.length} draft post(s):`);
      draftPosts.forEach(post => {
        console.log(`  - ${post.title} (${post.filename})`);
      });
      console.log('');

      const shouldContinue = await confirm({
        message: 'Do you want to continue with draft posts included?',
        initialValue: false
      });

      if (!shouldContinue) {
        outro('❌ Publish cancelled. Please set draft: false for posts you want to publish.');
        return;
      }
    }

    // Check for git changes
    if (!gitUtils.hasChanges()) {
      log.info('No changes to publish');
      outro('Done');
      return;
    }

    // Show changed files
    const changedFiles = gitUtils.getChangedFiles();
    if (changedFiles.length > 0) {
      console.log('\nChanged files:');
      changedFiles.forEach(file => console.log(`  - ${file}`));
      console.log('');
    }

    // Confirm before publishing
    const confirmed = await confirm({
      message: 'Are you ready to publish these changes to GitHub?',
      initialValue: true
    });

    if (!confirmed) {
      outro('❌ Publish cancelled');
      return;
    }

    // Build Hugo site
    const s = spinner();
    s.start('Building Hugo site...');
    try {
      buildHugo();
      s.stop('✅ Hugo site built successfully');
    } catch (error) {
      s.stop('❌ Hugo build failed');
      throw error;
    }

    // Commit changes
    s.start('Committing changes...');
    try {
      const commitMessage = await promptUtils.promptConfirmation('Use default commit message?');
      let message = 'Update blog';
      
      if (!commitMessage) {
        const customMessage = await promptUtils.promptConfirmation('Custom message: "Update blog with new posts"');
        message = customMessage ? 'Update blog with new posts' : 'Update blog';
      }

      gitUtils.commitChanges(message, config);
      s.stop('✅ Changes committed');
    } catch (error) {
      s.stop('❌ Commit failed');
      throw error;
    }

    // Push to GitHub
    s.start('Pushing to GitHub...');
    try {
      gitUtils.pushToGit();
      s.stop('✅ Pushed to GitHub successfully');
    } catch (error) {
      s.stop('❌ Push failed');
      throw error;
    }

    console.log('\n✅ Your blog has been published to GitHub!');
    console.log('Cloudflare Pages will automatically deploy your changes.\n');
    outro('Done');

  } catch (error) {
    if (error instanceof Error) {
      outro(`❌ Error: ${error.message}`);
    } else {
      outro('❌ An unknown error occurred');
    }
    process.exit(1);
  }
}