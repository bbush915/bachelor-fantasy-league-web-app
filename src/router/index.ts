import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import About from "@/components/pages/About/index.vue";
import ChangePassword from "@/components/pages/ChangePassword/index.vue";
import Contestants from "@/components/pages/Contestants/index.vue";
import ContestantScoreDetails from "@/components/pages/ContestantScoreDetails/index.vue";
import CreateLeague from "@/components/pages/CreateLeague/index.vue";
import EditProfile from "@/components/pages/EditProfile/index.vue";
import EditLeagueDetails from "@/components/pages/EditLeagueDetails/index.vue";
import EditLeagueMembers from "@/components/pages/EditLeagueMembers/index.vue";
import EditWeeklyScores from "@/components/pages/EditWeeklyScores/index.vue";
import EmailVerificationSent from "@/components/pages/EmailVerificationSent/index.vue";
import EmailVerificationSuccess from "@/components/pages/EmailVerificationSuccess/index.vue";
import FindLeague from "@/components/pages/FindLeague/index.vue";
import ForgotPassword from "@/components/pages/ForgotPassword/index.vue";
import Home from "@/components/pages/Home/index.vue";
import League from "@/components/pages/League/index.vue";
import LeagueHome from "@/components/pages/LeagueHome/index.vue";
import LeagueInformation from "@/components/pages/LeagueInformation/index.vue";
import Login from "@/components/pages/Login/index.vue";
import MyLeagues from "@/components/pages/MyLeagues/index.vue";
import OverallScoreDetails from "@/components/pages/OverallScoreDetails/index.vue";
import PasswordResetSent from "@/components/pages/PasswordResetSent/index.vue";
import Profile from "@/components/pages/Profile/index.vue";
import Registration from "@/components/pages/Registration/index.vue";
import ResetPassword from "@/components/pages/ResetPassword/index.vue";
import SetLineup from "@/components/pages/SetLineup/index.vue";
import VerifyEmail from "@/components/pages/VerifyEmail/index.vue";
import WeeklyScoreDetails from "@/components/pages/WeeklyScoreDetails/index.vue";
import { isAuthenticated } from "@/utils/authentication";
import { validateLeagueAccessibility, validateLeagueMembership, validateRole } from "./guards";

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
  {
    path: "/edit-weekly-scores",
    name: "edit-weekly-scores",
    component: EditWeeklyScores,
    beforeEnter: validateRole("admin"),
  },
  { path: "/find-league", name: "find-league", component: FindLeague },
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: ForgotPassword,
  },
  {
    path: "/leagues/:leagueId/info",
    name: "league-info",
    component: LeagueInformation,
    beforeEnter: validateLeagueAccessibility,
  },
  {
    path: "/leagues/:leagueId",
    component: League,
    meta: { requireAuth: true },
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
        path: "edit-league-details",
        name: "edit-league-details",
        component: EditLeagueDetails,
      },
      {
        path: "edit-league-members",
        name: "edit-league-members",
        component: EditLeagueMembers,
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
    beforeEnter: validateLeagueMembership,
  },
  { path: "/login", name: "login", component: Login },
  {
    path: "/my-leagues",
    name: "my-leagues",
    component: MyLeagues,
    meta: { requireAuth: true },
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: "/profile/change-password",
    name: "change-password",
    component: ChangePassword,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: "/profile/edit",
    name: "edit-profile",
    component: EditProfile,
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
  });

  router.beforeEach((to) => {
    if (to.meta.requireAuth && !isAuthenticated()) {
      return { name: "login", query: { redirect: to.name as string } };
    }
  });

  return router;
};
