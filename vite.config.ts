import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // CRITICAL for GitHub Pages
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['sprout-icon.svg', 'mask-icon.svg'],
      manifest: {
        name: 'Sprout Meditation',
        short_name: 'Sprout',
        description: 'Grow your mindfulness, one breath at a time',
        theme_color: '#678e7c',
        icons: [
          {
            src: 'sprout-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
