import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import About from "@/components/pages/About/index.vue";
import ChangePassword from "@/components/pages/ChangePassword/index.vue";
import Contestants from "@/components/pages/Contestants/index.vue";
import ContestantScoreDetails from "@/components/pages/ContestantScoreDetails/index.vue";
import CreateLeague from "@/components/pages/CreateLeague/index.vue";
import EditProfile from "@/components/pages/EditProfile/index.vue";
import EditLeague from "@/components/pages/EditLeague/index.vue";
import EmailVerificationSent from "@/components/pages/EmailVerificationSent/index.vue";
import EmailVerificationSuccess from "@/components/pages/EmailVerificationSuccess/index.vue";
import ForgotPassword from "@/components/pages/ForgotPassword/index.vue";
import Home from "@/components/pages/Home/index.vue";
import JoinLeague from "@/components/pages/JoinLeague/index.vue";
import League from "@/components/pages/League/index.vue";
import LeagueDetails from "@/components/pages/LeagueDetails/index.vue";
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
  {
    path: "/create-league",
    name: "create-league",
    component: CreateLeague,
    meta: { requireAuth: true },
  },
  { path: "/forgot-password", name: "forgot-password", component: ForgotPassword },
  { path: "/join-league", name: "join-league", component: JoinLeague },
  {
    path: "/leagues/:leagueId",
    component: League,
    children: [
      {
        path: "",
        name: "league-home",
        component: LeagueHome,
        meta: { requireAuth: true },
      },
      {
        path: "contestant-scores",
        name: "contestant-score-details",
        component: ContestantScoreDetails,
        meta: { requireAuth: true },
      },
      {
        path: "details",
        name: "league-details",
        component: LeagueDetails,
      },
      {
        path: "edit-league",
        name: "edit-league",
        component: EditLeague,
      },
      {
        path: "leaderboard",
        name: "overall-score-details",
        component: OverallScoreDetails,
        meta: { requireAuth: true },
      },
      {
        path: "set-lineup",
        name: "set-lineup",
        component: SetLineup,
        meta: { requireAuth: true },
      },
      {
        path: "weekly-scores",
        name: "weekly-score-details",
        component: WeeklyScoreDetails,
        meta: { requireAuth: true },
      },
    ],
  },
  { path: "/login", name: "login", component: Login },
  { path: "/my-leagues", name: "my-leagues", component: MyLeagues, meta: { requireAuth: true } },
  {
    path: "/profile",
    component: Profile,
    children: [
      {
        path: "",
        name: "view-profile",
        component: ViewProfile,
      },
      {
        path: "edit",
        name: "edit-profile",
        component: EditProfile,
      },
      {
        path: "change-password",
        name: "change-password",
        component: ChangePassword,
      },
    ],
    meta: {
      requireAuth: true,
    },
  },
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
  {
    path: "/verification/success",
    name: "email-verification-success",
    component: EmailVerificationSuccess,
    props: true,
    meta: { requireAuth: true },
  },
];

export const getRouter = () => {
  const router = createRouter({
    history: createWebHistory(),
    routes,

    scrollBehavior() {
      return { top: 0 };
    },
  });

  router.beforeEach((to) => {
    if (to.meta.requireAuth && !isAuthenticated()) {
      return { name: "login", query: { redirect: to.name as string } };
    }
  });

  return router;
};
