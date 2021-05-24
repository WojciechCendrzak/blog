import React from 'react';
import '../styles/global.css';

interface AppProps {
  Component: React.FunctionComponent;
  pageProps: Record<string, unknown>;
}

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default App;
