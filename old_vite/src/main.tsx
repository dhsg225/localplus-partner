import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import './styles/index.css';

console.log('🚀 Partner App Main.tsx loaded');

// Render the app with error handling
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ Root element not found!');
  document.body.innerHTML = '<div style="padding: 20px; color: red;">Error: Root element not found. Check index.html</div>';
  throw new Error('Root element not found');
}

console.log('✅ Root element found, rendering app...');

try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
  console.log('🎯 Partner App rendered successfully');
} catch (error) {
  console.error('❌ Error rendering app:', error);
  rootElement.innerHTML = `<div style="padding: 20px; color: red;">Error rendering app: ${error instanceof Error ? error.message : 'Unknown error'}</div>`;
}
