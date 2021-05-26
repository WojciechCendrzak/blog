import { GetStaticPaths, GetStaticProps } from 'next';
import { getPostData, getPostIds } from './post.api';

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getPostIds();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params || !params.id || Array.isArray(params.id)) return { props: {} };

  const postData = await getPostData(params.id);

  return {
    props: {
      postData,
    },
  };
};
