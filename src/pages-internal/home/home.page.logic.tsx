import { getPosts } from '../post/post.api';
import { GetStaticProps } from 'next';
import { HomeProps } from './home.page';

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const post = getPosts();
  return {
    props: {
      post,
    },
  };
};
