import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import About from "@/components/pages/About/index.vue";
import Contestants from "@/components/pages/Contestants/index.vue";
import ContestantScoreDetails from "@/components/pages/ContestantScoreDetails/index.vue";
import CreateLeague from "@/components/pages/CreateLeague/index.vue";
import Home from "@/components/pages/Home/index.vue";
import JoinLeague from "@/components/pages/JoinLeague/index.vue";
import LeaderboardDetails from "@/components/pages/LeaderboardDetails/index.vue";
import League from "@/components/pages/League/index.vue";
import LeagueHome from "@/components/pages/LeagueHome/index.vue";
import Login from "@/components/pages/Login/index.vue";
import MemberScoreDetails from "@/components/pages/MemberScoreDetails/index.vue";
import MyLeagues from "@/components/pages/MyLeagues/index.vue";
import Registration from "@/components/pages/Registration/index.vue";
import SetLineup from "@/components/pages/SetLineup/index.vue";
import { isAuthenticated } from "@/utils/authentication";

const routes: RouteRecordRaw[] = [
  { path: "/", name: "home", component: Home },
  { path: "/about", name: "about", component: About },
  { path: "/contestants", name: "contestants", component: Contestants },
  { path: "/login", name: "login", component: Login },
  { path: "/registration", name: "registration", component: Registration },
];

const authenticatedRoutes: RouteRecordRaw[] = [
  { path: "/join-league", name: "join-league", component: JoinLeague },
  { path: "/create-league", name: "create-league", component: CreateLeague },
  { path: "/my-leagues", name: "my-leagues", component: MyLeagues },
  {
    path: "/leagues/:leagueId",
    component: League,
    children: [
      {
        path: "",
        name: "league-home",
        component: LeagueHome,
      },
      {
        path: "set-lineup",
        name: "set-lineup",
        component: SetLineup,
      },
      {
        path: "leaderboard",
        name: "leaderboard-details",
        component: LeaderboardDetails,
      },
      {
        path: "contestant-scores",
        name: "contestant-score-details",
        component: ContestantScoreDetails,
      },
      {
        path: "member-scores",
        name: "member-score-details",
        component: MemberScoreDetails,
      },
    ],
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
