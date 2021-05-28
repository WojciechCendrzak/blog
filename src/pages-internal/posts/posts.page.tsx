import Head from 'next/head';
import { Layout } from '../../components/layout';
import React from 'react';
import { translate, translationKeys } from '../../logic/translations/translation.service';
import { Title } from '../../components/title';
import { PostCard } from './post-card/post-card';
import styled from 'styled-components';
import { Post } from '../post/post.model';

export interface HomeProps {
  post: Post[];
}

export const ArticlesPage: React.FC<HomeProps> = ({ post }) => {
  return (
    <Layout>
      <Head>
        <title>{translate(translationKeys.pages.posts.title)}</title>
      </Head>
      <section>
        <PostHeader>
          <Title>{translate(translationKeys.pages.posts.title)}</Title>
        </PostHeader>
        {post.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>
    </Layout>
  );
};

const PostHeader = styled.div`
  text-align: center;
`;
