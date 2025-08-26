import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@common': path.resolve(__dirname, 'src/components/common'),
      '@layout': path.resolve(__dirname, 'src/components/layout'),
      '@cards': path.resolve(__dirname, 'src/components/cards'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@authPages': path.resolve(__dirname, 'src/pages/Auth'),
      '@css': path.resolve(__dirname, 'src/css'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@context': path.resolve(__dirname, 'src/context'),
      '@router': path.resolve(__dirname, 'src/router'),
    },
  },
});
