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

interface PostPageProps {
  postData: Post;
}

export const PostPage: React.FC<PostPageProps> = ({ postData }) => {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <PostHeader>
          <Title>{postData.title}</Title>
          {postData.date && (
            <div>
              <Date date={postData.date} />
            </div>
          )}
          {postData.image && <PostImage priority src={postData.image} height={340} width={680} alt={postData.title} />}
        </PostHeader>
        <Content>
          <ReactMarkdown components={markDownComponents}>{postData.content || ''}</ReactMarkdown>
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
