import { Layout } from '../../components/layout';
import { getPostIds, getPostData } from './post.logic';
import Head from 'next/head';
import { Date } from '../../components/date';
import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import { Post } from './post.model';
import styled from 'styled-components';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import ReactMarkdown from 'react-markdown';
import { Components } from 'react-markdown/src/ast-to-react';

const components: Components = {
  code({ inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter language={match[1]} PreTag="div" {...props}>
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props} />
    );
  },
};

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
        <Title>{postData.title}</Title>
        {postData.date && (
          <div>
            <Date date={postData.date} />
          </div>
        )}
        <PostContent>
          <ReactMarkdown components={components}>{postData.content || ''}</ReactMarkdown>
        </PostContent>
      </article>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getPostIds();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params || !params.id || Array.isArray(params.id)) return { props: {} };

  const postData = await getPostData(params.id);

  return {
    props: {
      postData,
    },
  };
};

const Title = styled.h1`
  font-size: 36px;
  font-weight: 400;
`;

const PostContent = styled.div`
  font-weight: 100;
  line-height: 1.8;
  letter-spacing: -0.5px;
`;
