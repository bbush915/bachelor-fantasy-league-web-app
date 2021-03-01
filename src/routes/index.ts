import { createRouter, createWebHistory } from 'vue-router';

import About from '@/components/pages/About/index.vue';
import Contestants from '@/components/pages/Contestants/index.vue';
import JoinLeague from '@/components/pages/JoinLeague/index.vue';
import Home from '@/components/pages/Home/index.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/contestants', component: Contestants },
  { path: '/join-league', component: JoinLeague },
];

export const getRouter = () => {
  const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
      return { top: 0 };
    },
  });

  return router;
};
