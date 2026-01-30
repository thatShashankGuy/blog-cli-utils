export interface BlogPostMetadata {
  title: string;
  author: string;
  date: string;
  draft: boolean;
}

export interface PostListItem {
  filename: string;
  title: string;
  date: string;
  draft: boolean;
}