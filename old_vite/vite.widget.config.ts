import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
    define: {
        'process.env': {}
    },
    build: {
        // Output directly to public so it's served as a static asset
        outDir: 'public/widget',
        emptyOutDir: false, // Don't delete other public assets
        cssCodeSplit: false, // Force single CSS file
        rollupOptions: {
            input: {
                'menu-embed': resolve(__dirname, 'src/widget/index.tsx'),
            },
            output: {
                entryFileNames: '[name].js',
                assetFileNames: '[name].[ext]',
                // Ensure format is IIFE or UMD for browser compatibility 
                // without module loaders, but modern browsers handle ES modules fine.
                // We stick to ES module for now as it's cleaner for modern React.
                format: 'es'
            }
        }
    }
});
