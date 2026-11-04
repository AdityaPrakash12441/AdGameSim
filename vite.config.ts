import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative asset URLs allow the app to work at both the domain root and
  // a GitHub Pages repository path (for example, /my-project/).
  base: './',
});
