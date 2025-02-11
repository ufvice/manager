import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import Providers from './Providers';
import mermaid from 'mermaid';
import './translations/i18n';
import './styles/global.css';

// Initialize mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: 'neutral',
  securityLevel: 'loose',
  fontFamily: 'inherit'
});

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>
);