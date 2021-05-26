import Head from 'next/head';
import { Layout } from '../../components/layout';
import React from 'react';
import { translate, translationKeys } from '../../logic/translations/translation.service';
import { Title } from '../../components/title';
import { Content } from '../../components/content';
import { Avatar } from '../../components/avatar';
import styled from 'styled-components';

export const AboutMePage: React.FC = () => {
  return (
    <Layout>
      <Head>
        <title>{translate(translationKeys.pages.aboutMe.title)}</title>
      </Head>
      <Section>
        <Title>{translate(translationKeys.pages.aboutMe.title)}</Title>
        <Avatar
          priority
          src={'/images/profile.png'}
          height={120}
          width={120}
          alt={translate(translationKeys.pages.aboutMe.avatar.alt)}
        />
        <DescriptionContent>{translate(translationKeys.pages.aboutMe.description)}</DescriptionContent>
      </Section>
    </Layout>
  );
};

const Section = styled.section`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const DescriptionContent = styled(Content)`
  margin-top: 3rem;
`;
