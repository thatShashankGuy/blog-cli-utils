export interface BlogPost {
  title: string;
  date: string;
  author?: string;
  tags?: string[];
  categories?: string[];
  draft: boolean;
  slug: string;
  filename: string;
  content: string;
}

export interface BlogPostMetadata {
  title: string;
  date?: string;
  author?: string;
  tags?: string[];
  categories?: string[];
  draft?: boolean;
}

export interface PostListItem {
  filename: string;
  title: string;
  date: string;
  draft: boolean;
  tags?: string[];
}