export interface Config {
  // LLM Configuration
  llm: {
    apiKey: string;
    endpoint: string;
    model: string;
    siteUrl?: string;
    siteName?: string;
  };
  
  // Git Configuration
  git: {
    authorName: string;
    authorEmail: string;
    commitPrefix: string;
  };
  
  // Hugo Configuration
  hugo: {
    contentDir: string;
    defaultEditor: string;
  };
}