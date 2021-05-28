import Head from 'next/head';
import { Layout } from '../../components/layout';
import React from 'react';
import { translate, translationKeys } from '../../logic/translations/translation.service';
import styled from 'styled-components';
import { Title } from '../../components/title';
import { PostCard } from '../posts/post-card/post-card';
import { Post } from '../post/post.model';

export interface HomeProps {
  post: Post[];
}

export const HomePage: React.FC<HomeProps> = ({ post }) => {
  return (
    <Layout>
      <Head>
        <title>{translate(translationKeys.pages.home.title)}</title>
      </Head>
      <section>
        <HomeHeader>
          <Title>{translate(translationKeys.pages.home.title)}</Title>
        </HomeHeader>
        {post.slice(0, 1).map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>
    </Layout>
  );
};

const HomeHeader = styled.div`
  text-align: center;
`;
