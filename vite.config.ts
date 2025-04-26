import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Ejemplo de proxy para una API
      '/api': {
        target: 'http://localhost:3000', // URL de tu API
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      // Ejemplo de proxy para websockets
      '/ws': {
        target: 'ws://localhost:3000',
        ws: true
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
