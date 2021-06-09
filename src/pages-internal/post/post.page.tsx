import { Layout } from '../../components/layout';
import Head from 'next/head';
import { Date } from '../../components/date';
import React from 'react';
import { Post } from './post.model';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { markDownComponents } from './post.components';
import { LinkTo } from '../../components/link';
import { translate, translationKeys } from '../../logic/translations/translation.service';
import { Title } from '../../components/title';
import { Content } from '../../components/content';

export interface PostPageProps {
  post: Post;
}

export const PostPage: React.FC<PostPageProps> = ({ post }) => {
  return (
    <Layout>
      <Head>
        <title>{post.title}</title>
      </Head>
      <article>
        <PostHeader>
          <Title>{post.title}</Title>
          {post.date && (
            <div>
              <Date date={post.date} />
            </div>
          )}
          <div>{translate(translationKeys.pages.posts.readintTime, { readingTime: post.readingTimeInMinutes })}</div>
          {post.image && <PostImage priority src={post.image} height={400} width={680} alt={post.title} />}
        </PostHeader>
        <Content>
          <ReactMarkdown components={markDownComponents}>{post.content || ''}</ReactMarkdown>
        </Content>
        <div>
          <LinkTo href="/">{`← ${translate(translationKeys.common.buttons.backToHome.title)}`}</LinkTo>
        </div>
      </article>
    </Layout>
  );
};

const PostHeader = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  text-align: center;
`;

const PostImage = styled(Image)`
  object-fit: cover;
`;
