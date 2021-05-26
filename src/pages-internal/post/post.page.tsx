import { Layout } from '../../components/layout';
import Head from 'next/head';
import { Date } from '../../components/date';
import React from 'react';
import { Post } from './post.model';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { markDownComponents } from './post.components';

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
          <PostImage priority src="/images/translate.png" height={682 / 2} width={680} alt={''} />
        </PostHeader>
        <PostContent>
          <ReactMarkdown components={markDownComponents}>{postData.content || ''}</ReactMarkdown>
        </PostContent>
      </article>
    </Layout>
  );
};

const Title = styled.h1`
  font-size: 36px;
  font-weight: 400;
`;

const PostContent = styled.div`
  font-weight: 100;
  line-height: 1.8;
  letter-spacing: -0.5px;
  text-align: justify;
`;

const PostHeader = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  text-align: center;
`;

const PostImage = styled(Image)`
  border-width: 1px;
  border-color: black;
  border-style: solid;
  object-fit: cover;
`;
