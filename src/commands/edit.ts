import path from 'path';
import { getConfig } from '../config.js';
import * as fileUtils from '../utils/file.js';
import * as promptUtils from '../utils/prompts.js';
import { intro, outro, log } from '@clack/prompts';
import { execSync } from 'child_process';

export async function editPost(filename?: string): Promise<void> {
  intro('📝 Edit Blog Post');

  try {
    const config = getConfig();
    const contentDir = config.hugo.contentDir;
    const postsPath = path.join(process.cwd(), contentDir);

    let selectedFile = filename;

    // If no filename provided, list files and let user select
    if (!selectedFile) {
      const files = await fileUtils.listMarkdownFiles(postsPath);

      if (files.length === 0) {
        log.info('No blog posts found');
        outro('Done');
        return;
      }

      // Parse files for display
      const fileOptions = files.map(file => {
        const basename = path.basename(file);
        return {
          name: basename,
          value: file
        };
      });

      selectedFile = await promptUtils.promptFileSelection(fileOptions);
    }

    // Check if file exists
    if (!await fileUtils.fileExists(selectedFile)) {
      outro(`❌ File not found: ${selectedFile}`);
      return;
    }

    // Open in editor
    try {
      const editor = config.hugo.defaultEditor;
      log.message(`Opening ${path.basename(selectedFile)} in ${editor}...`);
      execSync(`${editor} "${selectedFile}"`, { stdio: 'inherit' });
      
      outro(`✅ Finished editing ${path.basename(selectedFile)}`);
    } catch (error) {
      outro(`❌ Failed to open editor: ${error instanceof Error ? error.message : 'Unknown error'}`);
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