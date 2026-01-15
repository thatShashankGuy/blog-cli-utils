import path from 'path';
import { getConfig } from '../config.js';
import * as fileUtils from '../utils/file.js';
import { intro, outro, log } from '@clack/prompts';
import { PostListItem } from '../types/blog.js';

export async function listPosts(filterDrafts: boolean | null = null): Promise<void> {
  intro('📝 Blog Posts');

  try {
    const config = getConfig();
    const contentDir = config.hugo.contentDir;
    const postsPath = path.join(process.cwd(), contentDir);

    const files = await fileUtils.listMarkdownFiles(postsPath);

    if (files.length === 0) {
      log.info('No blog posts found');
      outro('Done');
      return;
    }

    // Parse all posts
    const posts: PostListItem[] = [];
    for (const file of files) {
      try {
        const content = await fileUtils.readFile(file);
        const { metadata } = fileUtils.parseFrontmatter(content);
        
        posts.push({
          filename: path.basename(file),
          title: metadata.title || 'Untitled',
          date: metadata.date || new Date().toISOString(),
          draft: metadata.draft !== false,
          tags: metadata.tags || []
        });
      } catch (error) {
        console.error(`Error parsing ${file}:`, error);
      }
    }

    // Sort by date (newest first)
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Filter if requested
    let filteredPosts = posts;
    if (filterDrafts === true) {
      filteredPosts = posts.filter(p => p.draft);
    } else if (filterDrafts === false) {
      filteredPosts = posts.filter(p => !p.draft);
    }

    if (filteredPosts.length === 0) {
      const filterMsg = filterDrafts === true ? 'draft' : 'published';
      log.info(`No ${filterMsg} posts found`);
      outro('Done');
      return;
    }

    // Display posts
    console.log('\n');
    filteredPosts.forEach((post, index) => {
      const status = post.draft ? '📝 Draft' : '✅ Published';
      const date = new Date(post.date).toLocaleDateString();
      const tags = post.tags && post.tags.length > 0 ? `\n   Tags: ${post.tags.join(', ')}` : '';
      
      console.log(`${index + 1}. ${status} - ${post.title}`);
      console.log(`   Date: ${date} | File: ${post.filename}${tags}`);
      console.log('');
    });

    // Summary
    const draftCount = posts.filter(p => p.draft).length;
    const publishedCount = posts.filter(p => !p.draft).length;
    console.log(`\nTotal: ${posts.length} posts (${draftCount} drafts, ${publishedCount} published)`);

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