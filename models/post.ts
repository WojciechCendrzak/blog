export interface PostMeta {
  title?: string;
  date?: string;
  contentHtml?: string;
}

export interface Post extends PostMeta {
  id: string;
}
