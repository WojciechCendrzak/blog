import Head from 'next/head';
import { Layout } from '../../components/layout';
import React from 'react';
import { PostDescription } from '../post/post.model';
import { translate, translationKeys } from '../../logic/translations/translation.service';
import { Title } from '../../components/title';
import { PostCard } from './post-card/post-card';
import styled from 'styled-components';

export interface HomeProps {
  postDescriptions: PostDescription[];
}

export const ArticlesPage: React.FC<HomeProps> = ({ postDescriptions }) => {
  return (
    <Layout>
      <Head>
        <title>{translate(translationKeys.pages.articles.title)}</title>
      </Head>
      <section>
        <PostHeader>
          <Title>{translate(translationKeys.pages.articles.title)}</Title>
        </PostHeader>
        {postDescriptions.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>
    </Layout>
  );
};

const PostHeader = styled.div`
  text-align: center;
`;
