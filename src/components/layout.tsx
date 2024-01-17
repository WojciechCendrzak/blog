import Head from 'next/head';
import { translate, translationKeys } from '../logic/translations/translation.service';
import styled from 'styled-components';
import { Menu } from './menu/menu';
import { Footer } from './footer/footer';
import { PropsWithChildren, ReactNode } from 'react';
import { MIDDLE_COLUMN_SIZE, POST_MARGIN_BOTTOM } from '../const/sizes';

interface LayoutProps {
  leftSection?: ReactNode;
  rightSection?: ReactNode;
}
export const Layout = ({ children, leftSection, rightSection }: PropsWithChildren<LayoutProps>) => {
  return (
    <LayoutContainer>
      <div>
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
          <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@700&display=swap" rel="stylesheet" />
        </Head>
        <header>
          <Menu />
        </header>
        <MainContainer>
          <Side>{leftSection}</Side>
          <Main>{children}</Main>
          <Side>{rightSection}</Side>
        </MainContainer>
      </div>
      <footer>
        <Footer />
      </footer>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  min-height: 100vh;
  justify-content: space-between;
  flex-direction: column;
  display: flex;
`;

const MainContainer = styled.main`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 2rem;

  @media only screen and (max-width: 768px) {
    display: inherit;
  }
`;

const Main = styled.div`
  max-width: ${MIDDLE_COLUMN_SIZE};
  padding: 0 1rem ${POST_MARGIN_BOTTOM}px 1rem;
`;

const Side = styled.div`
  flex: 1;
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;
