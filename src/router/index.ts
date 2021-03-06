import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import About from "@/components/pages/About/index.vue";
import Contestants from "@/components/pages/Contestants/index.vue";
import Home from "@/components/pages/Home/index.vue";
import JoinLeague from "@/components/pages/JoinLeague/index.vue";
import LeagueHome from "@/components/pages/LeagueHome/index.vue";
import Login from "@/components/pages/Login/index.vue";
import SetLineup from "@/components/pages/SetLineup/index.vue";
import SignUp from "@/components/pages/SignUp/index.vue";
import { isAuthenticated } from "@/utils/authentication";

const routes: RouteRecordRaw[] = [
  { path: "/", name: "home", component: Home },
  { path: "/about", name: "about", component: About },
  { path: "/contestants", name: "contestants", component: Contestants },
  { path: "/join-league", name: "join-league", component: JoinLeague },
  { path: "/login", name: "login", component: Login },
  { path: "/sign-up", name: "sign-up", component: SignUp },
];

const authenticatedRoutes: RouteRecordRaw[] = [
  { path: "/leagues/:leagueId", name: "league-home", component: LeagueHome },
  {
    path: "/leagues/:leagueId/season-weeks/:seasonWeekId/set-lineup",
    name: "set-lineup",
    component: SetLineup,
  },
];

export const getRouter = () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [...routes, ...authenticatedRoutes],
    scrollBehavior() {
      return { top: 0 };
    },
  });

  router.beforeEach((to) => {
    if (authenticatedRoutes.find((x) => x.name === to.name) && !isAuthenticated()) {
      return "/login";
    }
  });

  return router;
};
