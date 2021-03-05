import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import About from "@/components/pages/About/index.vue";
import Contestants from "@/components/pages/Contestants/index.vue";
import Home from "@/components/pages/Home/index.vue";
import JoinLeague from "@/components/pages/JoinLeague/index.vue";
import LeagueHome from "@/components/pages/LeagueHome/index.vue";
import SetLineup from "@/components/pages/SetLineup/index.vue";

const routes: RouteRecordRaw[] = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/contestants", component: Contestants },
  { path: "/join-league", component: JoinLeague },
  { path: "/leagues/:leagueId", name: "league-home", component: LeagueHome },
  { path: "/leagues/:leagueId/season-weeks/:seasonWeekId/set-lineup", name: "set-lineup", component: SetLineup },
];

export const getRouter = () => {
  const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
      return { top: 0 };
    },
  });

  return router;
};
