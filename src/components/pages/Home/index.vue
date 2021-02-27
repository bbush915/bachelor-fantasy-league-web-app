<template>
  <div>
    <GradientOverlay />
    <SteamOverlay class="z-10" />

    <div class="h-full p-4 relative flex flex-col items-center">
      <div class="w-24 mb-40">
        <Logo />
      </div>

      <div class="w-80 relative mb-10">
        <div class="text-3xl text-center">Welcome to the Fantasy Suite</div>
        <div class="font-accent text-red text-4xl text-right">League</div>
        <Strikethrough class="title__strikethrough w-24" />
      </div>

      <button class="w-48 mb-6 p-3 rounded-full bg-pink">Sign up</button>

      <p class="mb-60">
        <span class="mr-2">Already have an account?</span>
        <router-link class="text-pink underline" to="/">Log in.</router-link>
      </p>

      <div class="space-y-4 mb-40">
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
import GradientOverlay from "@/components/simple/GradientOverlay/index.vue";
import SteamOverlay from "@/components/simple/SteamOverlay/index.vue";
import PetalLink from "./PetalLink.vue";

const links = [
  { to: "/about", content: "How it works" },
  { to: "/find-league", content: "Find a League" },
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