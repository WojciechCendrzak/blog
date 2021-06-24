export interface PostId {
  id: string;
}
export interface PostMeta {
  title?: string;
  date?: string;
  author?: string;
  image?: string;
  tags?: string;
  isPublished?: boolean;
  includeReferences?: string;
}

export interface Post extends PostId, PostMeta {
  content?: string;
  readingTimeInMinutes?: number;
}
