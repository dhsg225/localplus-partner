import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import './styles/index.css';

console.log('🚀 Partner App Main.tsx loaded');

// Render the app (health check removed)
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

console.log('🎯 Partner App rendered successfully');
