import { intro, outro } from '@clack/prompts';
import { startHugoServer } from '../utils/hugo.js';

export async function previewServer(port: number = 1313): Promise<void> {
  intro('🚀 Starting Hugo Preview Server');

  try {
    startHugoServer(port);
    
    // Note: startHugoServer runs the server indefinitely
    // The function won't return until the server is stopped
  } catch (error) {
    if (error instanceof Error) {
      outro(`❌ Error: ${error.message}`);
    } else {
      outro('❌ An unknown error occurred');
    }
    process.exit(1);
  }
}