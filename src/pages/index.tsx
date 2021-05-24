import Head from 'next/head';
import { Layout } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { getSortedPostsData } from '../logic/posts';
import Link from 'next/link';
import { Date } from '../components/date';
import { GetStaticProps } from 'next';
import React from 'react';
import { Post } from '../models/post';
import { translate, translationKeys } from '../logic/translations/translation.service';

interface HomeProps {
  allPostsData: Post[];
}

export const HomePage: React.FC<HomeProps> = ({ allPostsData }) => {
  return (
    <Layout home>
      <Head>
        <title>{translate(translationKeys.homePage.title)}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>{translate(translationKeys.homePage.aboutMe.title)}</p>
        <p>{translate(translationKeys.homePage.aboutMe.description)}</p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              {date && (
                <small className={utilStyles.lightText}>
                  <Date date={date} />
                </small>
              )}
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
};

export default HomePage;
