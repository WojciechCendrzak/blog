import React from 'react';
import type { AppProps } from 'next/app';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <>
    <GlobalStyle />
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  </>
);

export default App;

const GlobalStyle = createGlobalStyle`
  html,
  body {
    padding: 0;
    margin: 0;
    font-family: Roboto Mono, sans-serif;
    font-size: 18px;
  }

  * {
    box-sizing: border-box;
  }

  a {
    color: #0070f3;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

const theme = {
  colors: {
    primary: '#0070f3',
  },
};
