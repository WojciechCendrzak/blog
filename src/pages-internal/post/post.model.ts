export interface PostId {
  id: string;
}
export interface PostMeta {
  title?: string;
  date?: string;
  author?: string;
  image?: string;
}

export interface PostDescription extends PostId, PostMeta {}

export interface Post extends PostDescription {
  content?: string;
}
