import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post, PostDescription, PostMeta } from './post.model';

const postsDirectory = path.join(process.cwd(), 'src/content');

export const getPostDescriptions = (): PostDescription[] => {
  const fileNames = fs.readdirSync(postsDirectory);
  const postsMeta = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
      id,
      ...(matterResult.data as PostMeta),
    };
  });

  return postsMeta.filter(isPublished).sort(sortByMostRecent);
};

export const getPostIds = () => {
  const postDescriptions = getPostDescriptions();
  return postDescriptions.filter(isPublished).map((postDescription) => {
    return {
      params: {
        id: postDescription.id,
      },
    };
  });
};

export const getPostData = async (id: string): Promise<Post> => {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContent = fs.readFileSync(fullPath, 'utf8');
  const postMatter = matter(fileContent);

  return {
    id,
    content: postMatter.content,
    ...(postMatter.data as PostMeta),
  };
};

const isPublished = (post: PostDescription) => post.isPublished;

const sortByMostRecent = (a: PostDescription, b: PostDescription) => (b.date || '').localeCompare(a.date || '');
