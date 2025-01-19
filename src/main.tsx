import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import Providers from './Providers';
import './translations/i18n';
import './styles/global.css';

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>
);