import { createRouter, createWebHistory } from 'vue-router';

const HomePage = () => import('../pages/HomePage.vue');
const GalleryPage = () => import('../pages/GalleryPage.vue');
const ModsPage = () => import('../pages/ModsPage.vue');
const ProjectPage = () => import('../pages/ProjectPage.vue');

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: {
        seoTitle: 'Graphic Design & Music Production Portfolio',
        seoDescription:
          'Portfolio of Jeven Randhawa (JVN) featuring brand identity work, cover art, web projects, and music production collaborations.',
        seoType: 'ProfilePage'
      }
    },
    {
      path: '/mods',
      name: 'mods',
      component: ModsPage,
      meta: {
        seoTitle: 'Minecraft Mods',
        seoDescription: 'Minecraft mods by Jeven Randhawa spanning combat, atmosphere, survival systems, utilities, and village mechanics.',
        seoType: 'CollectionPage'
      }
    },
    {
      path: '/archive',
      alias: '/gallery',
      name: 'archive',
      component: GalleryPage,
      meta: {
        seoTitle: 'Output Archive',
        seoDescription: 'Search the complete JVN Graphics archive across visual identity, artwork, digital design, games, and audio.',
        seoType: 'CollectionPage'
      }
    },
    {
      path: '/work/:id',
      name: 'project',
      component: ProjectPage,
      meta: {
        seoTitle: 'Selected Output',
        seoDescription: 'A JVN Graphics project case study.',
        seoType: 'CreativeWork'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../pages/NotFoundPage.vue'),
      meta: {
        seoTitle: 'Page Not Found',
        seoDescription: 'The requested page could not be found. Browse the JVN Graphics portfolio or get in touch.',
        seoType: 'WebPage',
        seoNoIndex: true
      }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    const position = savedPosition || (to.hash
      ? {
        el: to.hash,
        top: 72,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      }
      : { left: 0, top: 0, behavior: 'instant' });

    if (to.path === from.path) return position;

    return new Promise((resolve) => {
      window.setTimeout(() => resolve(position), 160);
    });
  }
});

export default router;
