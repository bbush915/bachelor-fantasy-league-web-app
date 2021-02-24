import { createRouter, createWebHistory } from "vue-router";

import About from "@/components/pages/About/index.vue";
import Contestants from "@/components/pages/Contestants/index.vue";
import FindLeague from "@/components/pages/FindLeague/index.vue";
import Home from "@/components/pages/Home/index.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/contestants", component: Contestants },
  { path: "/find-league", component: FindLeague },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

export default router;
