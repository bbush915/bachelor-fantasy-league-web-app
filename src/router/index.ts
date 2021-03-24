import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import About from "@/components/pages/About/index.vue";
import Contestants from "@/components/pages/Contestants/index.vue";
import ContestantScoreDetails from "@/components/pages/ContestantScoreDetails/index.vue";
import CreateLeague from "@/components/pages/CreateLeague/index.vue";
import EditProfile from "@/components/pages/EditProfile/index.vue";
import EmailVerificationSent from "@/components/pages/EmailVerificationSent/index.vue";
import EmailVerificationSuccess from "@/components/pages/EmailVerificationSuccess/index.vue";
import ForgotPassword from "@/components/pages/ForgotPassword/index.vue";
import Home from "@/components/pages/Home/index.vue";
import JoinLeague from "@/components/pages/JoinLeague/index.vue";
import League from "@/components/pages/League/index.vue";
import LeagueHome from "@/components/pages/LeagueHome/index.vue";
import Login from "@/components/pages/Login/index.vue";
import MyLeagues from "@/components/pages/MyLeagues/index.vue";
import OverallScoreDetails from "@/components/pages/OverallScoreDetails/index.vue";
import PasswordResetSent from "@/components/pages/PasswordResetSent/index.vue";
import Profile from "@/components/pages/Profile/index.vue";
import Registration from "@/components/pages/Registration/index.vue";
import ResetPassword from "@/components/pages/ResetPassword/index.vue";
import SetLineup from "@/components/pages/SetLineup/index.vue";
import VerifyEmail from "@/components/pages/VerifyEmail/index.vue";
import ViewProfile from "@/components/pages/ViewProfile/index.vue";
import WeeklyScoreDetails from "@/components/pages/WeeklyScoreDetails/index.vue";
import { isAuthenticated } from "@/utils/authentication";

const routes: RouteRecordRaw[] = [
  { path: "/", name: "home", component: Home },
  { path: "/about", name: "about", component: About },
  { path: "/contestants", name: "contestants", component: Contestants },
  { path: "/forgot-password", name: "forgot-password", component: ForgotPassword },
  { path: "/join-league", name: "join-league", component: JoinLeague },
  { path: "/login", name: "login", component: Login },
  { path: "/registration", name: "registration", component: Registration },
  { path: "/reset-password", name: "reset-password", component: ResetPassword },
  {
    path: "/reset-password/sent",
    name: "password-reset-sent",
    component: PasswordResetSent,
    props: true,
  },
  {
    path: "/verification",
    name: "verify-email",
    component: VerifyEmail,
  },
  {
    path: "/verification/sent",
    name: "email-verification-sent",
    component: EmailVerificationSent,
    props: true,
  },
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
  { path: "/create-league", name: "create-league", component: CreateLeague },
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
        path: "contestant-scores",
        name: "contestant-score-details",
        component: ContestantScoreDetails,
      },
      {
        path: "leaderboard",
        name: "overall-score-details",
        component: OverallScoreDetails,
      },
      {
        path: "set-lineup",
        name: "set-lineup",
        component: SetLineup,
      },
      {
        path: "weekly-scores",
        name: "weekly-score-details",
        component: WeeklyScoreDetails,
      },
    ],
  },
  { path: "/my-leagues", name: "my-leagues", component: MyLeagues },
  {
    path: "/verification/success",
    name: "email-verification-success",
    component: EmailVerificationSuccess,
    props: true,
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
      return { name: "login", query: { redirect: to.name as string } };
    }
  });

  return router;
};
