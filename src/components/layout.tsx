import Head from 'next/head';
import { translate, translationKeys } from '../logic/translations/translation.service';
import styled from 'styled-components';
import { Menu } from './menu/menu';
import { Footer } from './footer/footer';

export const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Learn how to build a personal website using Next.js" />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            translate(translationKeys.site.title)
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={translate(translationKeys.site.title)} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Mono" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@100&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@700&display=swap" rel="stylesheet" />
      </Head>
      <header>
        <Menu />
      </header>
      <Main>
        <main>{children}</main>
      </Main>
      <Footer />
    </>
  );
};

const Main = styled.div`
  max-width: 36rem;
  padding: 0 1rem;
  margin: 0 auto 6rem;
`;
