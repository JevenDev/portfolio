import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : '/portfolio/',
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          framework: ['vue', 'vue-router'],
          animation: ['gsap', 'gsap/ScrollTrigger', 'gsap/ScrollToPlugin', 'gsap/SplitText']
        }
      }
    }
  }
}));
