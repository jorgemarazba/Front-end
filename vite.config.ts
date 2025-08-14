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
    port: 5173, // Cambia el puerto si lo necesitas
    open: true, // Abre el navegador automáticamente
    // proxy: {
    //   '/api': 'http://localhost:3000', // Proxy para peticiones API
    // },
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Cambia a true si necesitas mapas de fuente
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
