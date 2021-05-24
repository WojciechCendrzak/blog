import { Layout } from '../../components/layout';
import { getAllPostIds, getPostData } from '../../logic/posts';
import Head from 'next/head';
import { Date } from '../../components/date';
import utilStyles from '../../styles/utils.module.css';
import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import { Post } from '../../models/post';

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
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        {postData.date && (
          <div className={utilStyles.lightText}>
            <Date date={postData.date} />
          </div>
        )}
        {postData.contentHtml && <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />}
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
