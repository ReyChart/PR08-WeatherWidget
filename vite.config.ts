import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/PR08-WeatherWidget/',
  plugins: [react()],

  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
    extensions: ['.ts', '.tsx', 'json', '.js'],
  },

  server: {
    port: 3000,
    open: true,
    cors: true,
  },
});
