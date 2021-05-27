import Head from 'next/head';
import { Layout } from '../../components/layout';
import React from 'react';
import { PostDescription } from '../post/post.model';
import { translate, translationKeys } from '../../logic/translations/translation.service';
import styled from 'styled-components';
import { Title } from '../../components/title';
import { PostCard } from '../posts/post-card/post-card';

export interface HomeProps {
  postDescriptions: PostDescription[];
}

export const HomePage: React.FC<HomeProps> = ({ postDescriptions }) => {
  return (
    <Layout>
      <Head>
        <title>{translate(translationKeys.pages.home.title)}</title>
      </Head>
      <section>
        <HomeHeader>
          <Title>{translate(translationKeys.pages.home.title)}</Title>
        </HomeHeader>
        {postDescriptions.slice(0, 1).map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>
    </Layout>
  );
};

const HomeHeader = styled.div`
  text-align: center;
`;
