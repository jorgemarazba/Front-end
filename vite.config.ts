import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
server: {
  host: 'localhost',
  port: 5173,
  open: true,
  proxy: {
    '/api': {
      target: 'http://localhost:8000',  // Cambia a localhost para consistencia
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '/api'),
      secure: false,
      followRedirects: true,  // Agrega esto para manejar redirecciones internamente
    },
  },
},

// ... resto igual ...
  build: {
    outDir: 'dist',
    sourcemap: false, // Cambia a true si necesita mapas de fuente
    minify: 'esbuild', // Usa esbuild para minificación rápida
    chunkSizeWarningLimit: 500, // Límite de tamaño para chunks
  },
  optimizeDeps: {
    include: ['vue', 'pinia', 'vue-router'],
  },
  css: {
    preprocessorOptions: {
      // Ejemplo para variables globales en SCSS
      // scss: {
      //   additionalData: `@import "@/styles/variables.scss";`
      // },
    },
  },
});
