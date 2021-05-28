import { GetStaticPaths, GetStaticProps } from 'next';
import { getPost, getPostIds } from './post.api';

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getPostIds();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params || !params.id || Array.isArray(params.id)) return { props: {} };

  const post = getPost(params.id);

  return {
    props: {
      post,
    },
  };
};
