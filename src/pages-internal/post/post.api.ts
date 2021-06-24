import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post, PostMeta } from './post.model';

const WORDS_PER_MINUTE_SPEED = 200;

const postsDirectory = path.join(process.cwd(), 'src/content');

export const getPosts = (): Post[] => {
  const fileNames = fs.readdirSync(postsDirectory);
  const postsMeta = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');
    return getPost(id);
  });

  return postsMeta.filter(isPublished).sort(sortByMostRecent);
};

export const getPostIds = () => {
  const postDescriptions = getPosts();
  return postDescriptions.filter(isPublished).map((postDescription) => {
    return {
      params: {
        id: postDescription.id,
      },
    };
  });
};

export const getPost = (id: string): Post => {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContent = fs.readFileSync(fullPath, 'utf8');
  const postMatter = matter(fileContent);
  const postMeta = postMatter.data as PostMeta;
  const content = includeReferencesToPost(postMatter.content, postMeta.includeReferences);

  return {
    id,
    content: content,
    readingTimeInMinutes: getRedingTimeInMinutes(content),
    ...postMeta,
  };
};

const includeReferencesToPost = (content: string, includeReferences: string | undefined): string => {
  if (includeReferences) {
    const referenceContent = getReferenceContent(includeReferences);
    return content.replace(`{{${includeReferences}}}`, referenceContent);
  } else {
    return content;
  }
};

const getReferenceContent = (includeReferences: string) => getPost(includeReferences).content || '';

const getRedingTimeInMinutes = (content: string) =>
  Math.round((content.split(' ').length || 0) / WORDS_PER_MINUTE_SPEED);

const isPublished = (post: Post) => post.isPublished;

const sortByMostRecent = (a: Post, b: Post) => (b.date || '').localeCompare(a.date || '');
