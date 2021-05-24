import { Layout } from '../../components/layout';
import { getAllPostIds, getPostData } from '../../logic/posts';
import Head from 'next/head';
import { Date } from '../../components/date';
import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import { Post } from '../../models/post';
import styled from 'styled-components';

interface PostPageProps {
  postData: Post;
}

const PostPage: React.FC<PostPageProps> = ({ postData }) => {
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
          {postData.contentHtml && <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />}
        </PostContent>
      </article>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds();
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

export default PostPage;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 400;
`;

const PostContent = styled.div`
  font-weight: 100;
  line-height: 1.8;
  letter-spacing: -0.5px;
`;
