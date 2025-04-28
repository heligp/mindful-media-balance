import { defineConfig } from "vite";
import { VitePWA } from 'vite-plugin-pwa';
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
  base: '/mindful-media-balance/',
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'TimeGuardian – Mindful Media Balance',
        short_name: 'TimeGuardian',
        description: 'Controla y visualiza tu tiempo de uso en aplicaciones con estadísticas detalladas y notificaciones inteligentes.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#4f46e5',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/icons/timeguardian-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/timeguardian-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,json}'],
        runtimeCaching: [
          {
            urlPattern: /^\/(?:index\.html)?$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache'
            }
          },
          {
            urlPattern: /^\/*\.(js|css)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources'
            }
          }
        ]
      }
    })
  ].filter(Boolean),
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
