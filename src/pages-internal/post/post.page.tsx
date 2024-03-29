import { Layout } from '../../components/layout';
import Head from 'next/head';
import { Date } from '../../components/date';
import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import Image from 'next/image';
import { markDownComponents } from './post.components';
import rehypeRaw from 'rehype-raw';
import { LinkTo } from '../../components/link';
import { translate, translationKeys } from '../../logic/translations/translation.service';
import { Title } from '../../components/title';
import { Content } from '../../components/content';
import { Outline } from '../../components/outline';
import { PostPageProps } from './post.page.logic';

export const PostPage: React.FC<PostPageProps> = ({ post }) => {
  return post ? (
    <Layout leftSection={<Outline />}>
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
          <div>{`${post.readingTimeInMinutes} ${translate(translationKeys.pages.posts.min)}`}</div>
          {post.image && (
            <PostImageContainer>
              <PostImage priority src={post.image} height={400} width={680} alt={post.title || ''} />
            </PostImageContainer>
          )}
        </PostHeader>
        <Content>
          <ReactMarkdown
            remarkPlugins={[gfm]}
            skipHtml={false}
            rehypePlugins={[rehypeRaw]}
            components={markDownComponents}
          >
            {post.content || ''}
          </ReactMarkdown>
        </Content>
        <BackButton>
          <LinkTo href="/">{`← ${translate(translationKeys.common.buttons.backToHome.title)}`}</LinkTo>
        </BackButton>
      </article>
    </Layout>
  ) : null;
};

const PostHeader = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  text-align: center;
`;

const PostImageContainer = styled.div`
  padding-top: 1rem;
`;

const PostImage = styled(Image)`
  object-fit: cover;
`;

const BackButton = styled.div`
  margin-top: 5rem;
`;
