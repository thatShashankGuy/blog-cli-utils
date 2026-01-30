export interface GitHubFile {
  name: string;
  path: string;
  type: string;
}

export interface GitHubFileContent {
  content: string;
  encoding: string;
}

export interface GitHubAPIError {
  message: string;
  documentation_url?: string;
}