import { getPosts } from '../post/post.api';
import { GetStaticProps } from 'next';
import { HomeProps } from './posts.page';

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const post = getPosts();
  return {
    props: {
      post,
    },
  };
};
