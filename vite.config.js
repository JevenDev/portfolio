import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
const isUserOrOrgPage = repoName.endsWith('.github.io');
const base = isGitHubActions && repoName && !isUserOrOrgPage ? `/${repoName}/` : '/';

export default defineConfig({
  base,
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
});
