import React, { useCallback, useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Components } from 'react-markdown/src/ast-to-react';
import styled from 'styled-components';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { postSlice } from '../../logic/store/post.slice';
import { OutlineItem } from '../../logic/store/outline.model';
import { MARGIN } from '../../const/sizes';

export const H2: React.FC = ({ children }) => {
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
    };
    dispatch(postSlice.actions.setOutlineItemReached({ outlineItem }));
  }, [dispatch, title, isReached]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return <h2 ref={ref}>{children}</h2>;
};

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
};

const Code = styled(SyntaxHighlighter)`
  background: #f1f1f1 !important;
  border-radius: 8px;
  text-shadow: none !important;

  code {
    text-shadow: none !important;
  }

  .token {
    background: transparent !important;
  }
`;
