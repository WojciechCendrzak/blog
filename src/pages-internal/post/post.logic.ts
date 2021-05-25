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

  return postsMeta.sort((a, b) => {
    if (!a.date || !b.date) return 0;

    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
};

export const getPostIds = () => {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
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
