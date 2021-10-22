import { GetStaticPaths, GetStaticProps } from 'next';
import { getPost, getPostIds } from './post.api';
import { Post } from './post.model';

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getPostIds();
  return {
    paths,
    fallback: false,
  };
};

export interface PostPageProps {
  post?: Post;
}

export const getStaticProps: GetStaticProps<PostPageProps> = async ({ params }) => {
  if (!params || !params.id || Array.isArray(params.id)) return { props: {} };

  const post = getPost(params.id);

  return {
    props: {
      post,
    },
  };
};
