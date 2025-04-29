import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ChattingProvider from './contexts/ChattingProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ChattingProvider>
    <App />
  </ChattingProvider>
);
