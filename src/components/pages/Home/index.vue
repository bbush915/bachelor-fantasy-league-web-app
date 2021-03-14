<template>
  <div>
    <GradientOverlay />
    <SteamOverlay class="z-10" />

    <div class="relative flex flex-col items-center h-full p-4">
      <div class="w-24 mb-40">
        <Logo />
      </div>

      <div class="relative mb-10 w-80">
        <div class="text-3xl font-light text-center">Welcome to the Fantasy Suite</div>
        <div class="text-4xl text-right font-accent text-red">League</div>
        <Strikethrough class="w-24 title__strikethrough" />
      </div>

      <router-link class="mb-6 btn-primary" to="/registration"> Sign up </router-link>

      <p class="mb-60">
        <span class="mr-2 font-extralight">Already have an account?</span>

        <router-link class="underline text-pink" to="/login">Log in.</router-link>
      </p>

      <div class="mb-40 space-y-4">
        <PetalLink
          v-for="(link, index) in links"
          :key="index"
          :to="link.to"
          :content="link.content"
          :mirror="index % 2 === 1"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Logo from "@/assets/logo.svg";
import Strikethrough from "@/assets/strikethrough.svg";
import GradientOverlay from "@/components/common/GradientOverlay/index.vue";
import SteamOverlay from "@/components/common/SteamOverlay/index.vue";
import PetalLink from "./PetalLink.vue";

const links = [
  { to: "/about", content: "How it works" },
  { to: "/join-league", content: "Join a League" },
  { to: "/contestants", content: "Contestants" },
];

const Home = defineComponent({
  name: "Home",

  components: {
    GradientOverlay,
    Logo,
    PetalLink,
    SteamOverlay,
    Strikethrough,
  },

  setup() {
    return {
      links,
    };
  },
});

export default Home;
</script>

<style scoped>
.title__strikethrough {
  position: absolute;
  bottom: 54px;
  right: 48px;
}
</style>
