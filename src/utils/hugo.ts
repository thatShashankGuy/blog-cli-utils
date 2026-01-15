import { execSync } from 'child_process';
import { spawn } from 'child_process';

export function buildHugo(): void {
  try {
    execSync('hugo', { stdio: 'inherit' });
  } catch (error) {
    throw new Error('Hugo build failed. Make sure Hugo is installed and in your PATH.');
  }
}

export function startHugoServer(port = 1313): void {
  console.log(`Starting Hugo development server on http://localhost:${port}`);
  console.log('Press Ctrl+C to stop the server.\n');
  
  const hugo = spawn('hugo', ['server', '--buildDrafts', '--port', port.toString()], {
    stdio: 'inherit',
    shell: true
  });
  
  hugo.on('error', (error) => {
    console.error('Failed to start Hugo server:', error);
    process.exit(1);
  });
  
  hugo.on('close', (code) => {
    console.log(`\nHugo server stopped with exit code ${code}`);
  });
}