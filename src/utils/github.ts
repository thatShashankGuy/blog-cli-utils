import { GitHubFile } from "../types/github.js";

export interface GitHubConfig {
  owner: string;
  repo: string;
  token: string;
  branch: string;
  contentPath: string;
}

export class GitHubAPI {
  private config: GitHubConfig;
  private baseUrl = "https://api.github.com";

  constructor(config: GitHubConfig) {
    this.config = config;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log(`Requesting ${url}`);
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `token ${this.config.token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "User-Agent": "blog-cli",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      throw new Error(
        `GitHub API Error (${response.status}): ${error.message}`,
      );
    }

    return response.json();
  }

  async listMarkdownFiles(): Promise<GitHubFile[]> {
    const response = await this.request<{ name: string; type: string }[]>(
      `/repos/${this.config.owner}/${this.config.repo}/contents/${this.config.contentPath}?ref=${this.config.branch}`,
    );
    return response.filter(
      (file) => file.type === "file" && file.name.endsWith(".md"),
    );
  }

  async getFile(path: string): Promise<string> {
    const response = await this.request<{ content: string; encoding: string }>(
      `/repos/${this.config.owner}/${this.config.repo}/contents/${path}?ref=${this.config.branch}`,
    );
    return Buffer.from(response.content, "base64").toString("utf-8");
  }

  async createFile(
    path: string,
    content: string,
    message: string,
  ): Promise<void> {
    const encodedContent = Buffer.from(content, "utf-8").toString("base64");

    await this.request(
      `/repos/${this.config.owner}/${this.config.repo}/contents/${path}`,
      {
        method: "PUT",
        body: JSON.stringify({
          message,
          content: encodedContent,
          branch: this.config.branch,
        }),
      },
    );
  }

  async updateFile(
    path: string,
    content: string,
    message: string,
    sha: string,
  ): Promise<void> {
    const encodedContent = Buffer.from(content, "utf-8").toString("base64");

    await this.request(
      `/repos/${this.config.owner}/${this.config.repo}/contents/${path}`,
      {
        method: "PUT",
        body: JSON.stringify({
          message,
          content: encodedContent,
          sha,
          branch: this.config.branch,
        }),
      },
    );
  }
}
