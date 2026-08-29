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
        seoType: 'ProfilePage',
        seoKeywords: ['Jeven Randhawa', 'JVN Graphics', 'graphic designer', 'brand identity', 'album cover art', 'music producer']
      }
    },
    {
      path: '/mods',
      name: 'mods',
      component: ModsPage,
      meta: {
        seoTitle: 'Minecraft Mods',
        seoDescription: 'Minecraft mods by Jeven Randhawa spanning combat, atmosphere, survival systems, utilities, and village mechanics.',
        seoType: 'CollectionPage',
        seoKeywords: ['Minecraft mods', 'JVN mods', 'Modrinth creator', 'NeoForge mods', 'Fabric mods']
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
        seoType: 'CollectionPage',
        seoKeywords: ['creative archive', 'portfolio projects', 'graphic design gallery', 'cover art portfolio', 'motion design']
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
      redirect: '/'
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    const position = savedPosition || (to.hash
      ? {
        el: to.hash,
        top: 72,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      }
      : { left: 0, top: 0 });

    if (to.path === from.path) return position;

    return new Promise((resolve) => {
      window.setTimeout(() => resolve(position), 160);
    });
  }
});

export default router;
