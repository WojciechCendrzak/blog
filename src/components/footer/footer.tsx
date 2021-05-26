import styled from 'styled-components';
import Image from 'next/image';

export const Footer = () => {
  return (
    <FooterContainer>
      <FooterItem>
        <a href="https://www.linkedin.com/in/wojciech-cendrzak-02188236/">
          <Image color="#FFF" priority src={'/icons/in.svg'} height={48} width={48} alt={'LinkedIn'} />
        </a>
      </FooterItem>
      <FooterItem>
        <a href="https://github.com/WojciechCendrzak">
          <Image color="#FFF" priority src={'/icons/git.svg'} height={48} width={48} alt={'Github'} />
        </a>
      </FooterItem>
    </FooterContainer>
  );
};

const FooterContainer = styled.div`
  background: black;
  padding: 3rem;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const FooterItem = styled.div`
  margin-left: 16px;
`;
