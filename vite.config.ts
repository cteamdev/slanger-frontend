import { defineConfig } from 'vite';
import { readFileSync } from 'fs';

import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],

  server: {
    https: {
      key: readFileSync('./localhost.key'),
      cert: readFileSync('./localhost.cert')
    },
    port: 10888,
    host: true,
    proxy: {
      'https://localhost:10888/': 'https://localhost:10888/'
    }
  },

  build: {
    outDir: 'build'
  }
});
