import { execSync } from 'child_process';
import { Config } from '../types/config.js';

export function executeCommand(command: string, cwd?: string): string {
  try {
    return execSync(command, {
      cwd: cwd || process.cwd(),
      encoding: 'utf-8',
      stdio: 'pipe'
    }).trim();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Git command failed: ${error.message}`);
    }
    throw new Error('Git command failed');
  }
}

export function hasChanges(): boolean {
  try {
    const status = executeCommand('git status --porcelain');
    return status.length > 0;
  } catch {
    return false;
  }
}

export function getCurrentBranch(): string {
  return executeCommand('git rev-parse --abbrev-ref HEAD');
}

export function commitChanges(message: string, config: Config): void {
  const { authorName, authorEmail, commitPrefix } = config.git;
  
  // Set git config for this repository
  if (authorName) {
    executeCommand(`git config user.name "${authorName}"`);
  }
  if (authorEmail) {
    executeCommand(`git config user.email "${authorEmail}"`);
  }
  
  // Add all changes
  executeCommand('git add .');
  
  // Commit with prefix
  const fullMessage = commitPrefix ? `${commitPrefix} ${message}` : message;
  executeCommand(`git commit -m "${fullMessage}"`);
}

export function pushToGit(branch?: string): void {
  const targetBranch = branch || getCurrentBranch();
  executeCommand(`git push origin ${targetBranch}`);
}

export function getChangedFiles(): string[] {
  try {
    const output = executeCommand('git diff --name-only HEAD');
    if (!output) return [];
    return output.split('\n').filter(f => f.trim());
  } catch {
    return [];
  }
}