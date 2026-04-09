import { createRouter, createWebHistory } from 'vue-router';

const HomePage = () => import('../pages/HomePage.vue');
const GalleryPage = () => import('../pages/GalleryPage.vue');

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
        seoKeywords: [
          'Jeven Randhawa',
          'JVN Graphics',
          'graphic designer',
          'brand identity',
          'album cover art',
          'music producer'
        ]
      }
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: GalleryPage,
      meta: {
        seoTitle: 'Full Works Gallery',
        seoDescription:
          'Browse Jeven Randhawa\'s full gallery of projects, artwork, motion pieces, and music-focused creative work.',
        seoType: 'CollectionPage',
        seoKeywords: [
          'creative gallery',
          'portfolio projects',
          'graphic design gallery',
          'cover art portfolio',
          'motion design',
          'music production portfolio'
        ]
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }

    if (to.path === '/gallery' && from.path !== '/gallery') {
      return {
        left: 0,
        top: 0
      };
    }

    return false;
  }
});

export default router;
