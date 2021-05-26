import Head from 'next/head';
import { Layout } from '../../components/layout';
import Link from 'next/link';
import { Date } from '../../components/date';
import React from 'react';
import { PostDescription } from '../post/post.model';
import { translate, translationKeys } from '../../logic/translations/translation.service';

export interface HomeProps {
  postDescriptions: PostDescription[];
}

export const HomePage: React.FC<HomeProps> = ({ postDescriptions }) => {
  return (
    <Layout>
      <Head>
        <title>{translate(translationKeys.pages.home.title)}</title>
      </Head>
      <section>
        <h2>Blog</h2>
        <ul>
          {postDescriptions.map(({ id, date, title }) => (
            <li key={id}>
              <Link href={`/post/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              {date && (
                <small>
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
