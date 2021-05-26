import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Components } from 'react-markdown/src/ast-to-react';
import styled from 'styled-components';

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
