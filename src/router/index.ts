import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import About from "@/components/pages/About/index.vue";
import Contestants from "@/components/pages/Contestants/index.vue";
import ContestantScoreDetails from "@/components/pages/ContestantScoreDetails/index.vue";
import CreateLeague from "@/components/pages/CreateLeague/index.vue";
import EditProfile from "@/components/pages/EditProfile/index.vue";
import ViewProfile from "@/components/pages/ViewProfile/index.vue";
import Home from "@/components/pages/Home/index.vue";
import JoinLeague from "@/components/pages/JoinLeague/index.vue";
import League from "@/components/pages/League/index.vue";
import LeagueDetails from "@/components/pages/LeagueDetails/index.vue";
import LeagueHome from "@/components/pages/LeagueHome/index.vue";
import Login from "@/components/pages/Login/index.vue";
import MyLeagues from "@/components/pages/MyLeagues/index.vue";
import OverallScoreDetails from "@/components/pages/OverallScoreDetails/index.vue";
import Profile from "@/components/pages/Profile/index.vue";
import Registration from "@/components/pages/Registration/index.vue";
import SetLineup from "@/components/pages/SetLineup/index.vue";
import WeeklyScoreDetails from "@/components/pages/WeeklyScoreDetails/index.vue";
import { isAuthenticated } from "@/utils/authentication";

const routes: RouteRecordRaw[] = [
  { path: "/", name: "home", component: Home },
  { path: "/about", name: "about", component: About },
  { path: "/contestants", name: "contestants", component: Contestants },
  { path: "/login", name: "login", component: Login },
  { path: "/registration", name: "registration", component: Registration },
  { path: "/leagues/:leagueId/details", name: "league-details", component: LeagueDetails },
];

const authenticatedRoutes: RouteRecordRaw[] = [
  {
    path: "/profile",
    component: Profile,
    children: [
      {
        path: "",
        name: "profile",
        component: ViewProfile,
      },
      {
        path: "edit-profile",
        name: "edit-profile",
        component: EditProfile,
      },
    ],
  },
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
        name: "overall-score-details",
        component: OverallScoreDetails,
      },
      {
        path: "contestant-scores",
        name: "contestant-score-details",
        component: ContestantScoreDetails,
      },
      {
        path: "weekly-scores",
        name: "weekly-score-details",
        component: WeeklyScoreDetails,
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
