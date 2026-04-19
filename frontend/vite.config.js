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

