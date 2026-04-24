import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { svgSpritemap } from 'vite-plugin-svg-spritemap';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgSpritemap({
      pattern: 'src/assets/icons/*.svg',
      filename: 'sprite.svg',
      svgo: {
        plugins: [
          {
            name: 'convertColors',
            params: { currentColor: true } 
          }
        ]
      }
    }),
  ],
  server: {
    proxy: {
      '/rss-proxy': {
        target: 'https://sutd.ru',
        changeOrigin: true,
        rewrite: () => '/rss.php',
        secure: false,
      },
      '/trudvsem-proxy': {
        target: 'https://opendata.trudvsem.ru',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/trudvsem-proxy/, ''),
        secure: false,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; StudentPortal/1.0)',
        },
      },
      '/leader-proxy': {
        target: 'https://leader-id.ru',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/leader-proxy/, ''),
        secure: false,
      },
      '/teachers-proxy': {
        target: 'https://sutd.ru',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/teachers-proxy/, ''),
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@components': path.resolve(__dirname, './src/components'),
      '@icon': path.resolve(__dirname, './src/components/icon'),
      '@icons': path.resolve(__dirname, './src/components/icons'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@supabaseClient': path.resolve(__dirname, './src/supabaseClient'),
    },
  },
});

