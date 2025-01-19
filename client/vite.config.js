import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensures the build output goes to the 'dist' folder
    emptyOutDir: true, // Clears the output folder before building
  },
  define: {
    'process.env': {}, // Polyfill for `process.env` if needed
    global: 'window', // Polyfill `global` as `window`
  },
});
