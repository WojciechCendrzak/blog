import { getPostDescriptions } from '../post/post.api';
import { GetStaticProps } from 'next';
import { HomeProps } from './posts.page';

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const postDescriptions = getPostDescriptions();
  return {
    props: {
      postDescriptions,
    },
  };
};
