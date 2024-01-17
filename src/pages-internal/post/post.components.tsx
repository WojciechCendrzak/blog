import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter, SyntaxHighlighterProps } from 'react-syntax-highlighter';
import type { Components } from 'react-markdown';
import styled from 'styled-components';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { postSlice } from '../../logic/store/post.slice';
import { OutlineItem } from '../../logic/store/outline.model';
import { MARGIN } from '../../const/sizes';
import { colors } from '../../const/colors';

interface HeaderProps {
  level: number;
}
const Header = ({ level, children }: PropsWithChildren<HeaderProps>) => {
  const dispatch = useDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const [isReached, setIsReached] = useState(false);

  const handleScroll = useCallback(() => {
    const { scrollY } = window;
    const isReached = scrollY + MARGIN > (ref.current?.offsetTop || 0);
    setIsReached(isReached);
  }, []);

  const title = `${children}`;

  useEffect(() => {
    const outlineItem: OutlineItem = {
      title,
      isReached,
      offsetTop: ref.current?.offsetTop || 0,
      level,
    };
    dispatch(postSlice.actions.setOutlineItemReached({ outlineItem }));
  }, [dispatch, title, isReached, level]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  switch (level) {
    case 2:
      return <h2 ref={ref}>{children}</h2>;
    case 3:
      return <h3 ref={ref}>{children}</h3>;
    case 4:
      return <h4 ref={ref}>{children}</h4>;
    default:
      return <h2 ref={ref}>{children}</h2>;
  }
};

const H2 = ({ children }: PropsWithChildren) => <Header level={2}>{children}</Header>;
const H3 = ({ children }: PropsWithChildren) => <Header level={3}>{children}</Header>;
const H4 = ({ children }: PropsWithChildren) => <Header level={4}>{children}</Header>;

export const markDownComponents: Components = {
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    return match ? (
      <Code language={match[1]} PreTag="div">
        {String(children).replace(/\n$/, '')}
      </Code>
    ) : (
      <code className={className} {...props} />
    );
  },
  h2: H2,
  h3: H3,
  h4: H4,
};

// @ts-expect-error After lib upgrade, the type is not correct
const Code = styled(SyntaxHighlighter)<SyntaxHighlighterProps>`
  background: ${colors.codeBackground} !important;
  border-radius: 8px;
  text-shadow: none !important;

  code {
    text-shadow: none !important;
  }

  .token {
    background: transparent !important;
  }
`;
