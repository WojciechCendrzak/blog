import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Components } from 'react-markdown/src/ast-to-react';

export const markDownComponents: Components = {
  code({ inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter language={match[1]} PreTag="div" {...props}>
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props} />
    );
  },
};
