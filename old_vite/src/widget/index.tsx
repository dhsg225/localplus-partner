import React from 'react';
import ReactDOM from 'react-dom/client';
import MenuWidget from './MenuWidget';
// Import styles to ensure they are bundled
import '../styles/index.css';

console.log('🍽️ LocalPlus Menu Widget Loaded');

// Find all widget roots
const widgetRoots = document.querySelectorAll('.localplus-menu-root');

widgetRoots.forEach((root) => {
    // Prevent double hydration
    if (root.hasAttribute('data-hydrated')) return;

    const businessId = (root as HTMLElement).dataset.bid;
    if (businessId) {
        ReactDOM.createRoot(root).render(
            <React.StrictMode>
                <MenuWidget businessId={businessId} />
            </React.StrictMode>
        );
        root.setAttribute('data-hydrated', 'true');
    }
});
