export interface Config {
  llm: {
    apiKey: string;
    endpoint: string;
    model: string;
    siteUrl?: string;
    siteName?: string;
  };

  github: {
    owner: string;
    repo: string;
    token: string;
    branch: string;
    contentPath: string;
    url?: string;
  };

  author: string;
}