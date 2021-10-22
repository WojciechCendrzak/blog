import React, { useCallback, useEffect, useState } from 'react';
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
const Header: React.FC<HeaderProps> = ({ level, children }) => {
  const dispatch = useDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const [isReached, setIsReached] = useState(false);

  const handleScroll = useCallback(() => {
    const { scrollY } = window;
    const isReached = scrollY + MARGIN > (ref.current?.offsetTop || 0);
    setIsReached(isReached);
  }, []);

  const title = ((children || ['']) as string[])[0];

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

const H2: React.FC<HeaderProps> = ({ children }) => <Header level={2}>{children}</Header>;
const H3: React.FC<HeaderProps> = ({ children }) => <Header level={3}>{children}</Header>;
const H4: React.FC<HeaderProps> = ({ children }) => <Header level={4}>{children}</Header>;

export const markDownComponents: Components = {
  code({ inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <Code language={match[1]} PreTag="div" {...props}>
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
