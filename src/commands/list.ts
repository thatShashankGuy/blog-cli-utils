import { getConfig } from "../config.js";
import * as fileUtils from "../utils/file.js";
import { GitHubAPI } from "../utils/github.js";
import { intro, outro, log, spinner } from "@clack/prompts";
import { PostListItem } from "../types/blog.js";

export async function listPosts(
  filterDrafts: boolean | null = null,
): Promise<void> {
  intro("📝 Blog Posts");

  try {
    const config = getConfig();
    const github = new GitHubAPI(config.github);

    const s = spinner();
    s.start('Fetching posts from GitHub...');

    const files = await github.listMarkdownFiles();

    if (files.length === 0) {
      s.stop('No blog posts found');
      log.info("No blog posts found");
      outro("Done");
      return;
    }

    s.stop(`Found ${files.length} posts`);

    // Parse all posts
    const posts: PostListItem[] = [];
    for (const file of files) {
      try {
        const content = await github.getFile(file.path);
        const { metadata } = fileUtils.parseFrontmatter(content);

        posts.push({
          filename: file.name,
          title: metadata.title || "Untitled",
          date: metadata.date || new Date().toISOString(),
          draft: metadata.draft === true,
        });
      } catch (error) {
        console.error(`Error parsing ${file.name}:`, error);
      }
    }

    // Sort by date (newest first)
    posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    // Filter if requested
    let filteredPosts = posts;
    if (filterDrafts === true) {
      filteredPosts = posts.filter((p) => p.draft);
    } else if (filterDrafts === false) {
      filteredPosts = posts.filter((p) => !p.draft);
    }

    if (filteredPosts.length === 0) {
      const filterMsg = filterDrafts === true ? "draft" : "published";
      log.info(`No ${filterMsg} posts found`);
      outro("Done");
      return;
    }

    // Display posts
    console.log("\n");
    filteredPosts.forEach((post, index) => {
      const status = post.draft ? "📝 Draft" : "✅ Published";
      const date = new Date(post.date).toLocaleDateString();

      console.log(`${index + 1}. ${status} - ${post.title}`);
      console.log(`   Date: ${date} | File: ${post.filename}`);
      console.log("");
    });

    // Summary
    const draftCount = posts.filter((p) => p.draft).length;
    const publishedCount = posts.filter((p) => !p.draft).length;
    console.log(
      `\nTotal: ${posts.length} posts (${draftCount} drafts, ${publishedCount} published)`,
    );

    outro("Done");
  } catch (error) {
    if (error instanceof Error) {
      outro(`❌ Error: ${error.message}`);
    } else {
      outro("❌ An unknown error occurred");
    }
    process.exit(1);
  }
}