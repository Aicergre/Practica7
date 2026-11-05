import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.jsx';
import { FerreteriaProvider } from './context/FerreteriaContext';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FerreteriaProvider>
      <App />
    </FerreteriaProvider>
  </React.StrictMode>
);