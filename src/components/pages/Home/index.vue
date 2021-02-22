<template>
  <div class="home h-full p-4 flex flex-col items-center">
    <div class="home__overlay fixed h-full w-full" />

    <div class="w-32 mb-40">
      <Logo />
    </div>

    <div class="w-80 relative mb-10">
      <div class="text-white text-3xl text-center">
        Welcome to the Fantasy Suite
      </div>
      <div class="font-accent text-red text-4xl text-right">League</div>
      <Strikethrough class="title__strikethrough w-24" />
    </div>

    <button class="w-72 mb-6 p-4 rounded-full bg-pink text-2xl">Sign Up</button>

    <p class="mb-60 text-white text-2xl">
      <span class="mr-2">Already have an account?</span>
      <router-link class="text-pink underline" to="/">Log in.</router-link>
    </p>

    <div class="space-y-4">
      <PetalLink
        v-for="(link, index) in links"
        :key="index"
        :to="link.to"
        :content="link.content"
        :mirror="index % 2 === 1"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Logo from "@/assets/logo.svg";
import Strikethrough from "@/assets/strikethrough.svg";
import PetalLink from "./PetalLink.vue";

const Home = defineComponent({
  name: "Home",

  components: {
    Logo,
    PetalLink,
    Strikethrough,
  },

  setup() {
    const links = [
      { to: "/", content: "How it Works" },
      { to: "/", content: "Find a League" },
      { to: "/", content: "Contestants" },
    ];

    return {
      links,
    };
  },
});

export default Home;
</script>

<style scoped>
.home {
  background: linear-gradient(
    rgba(80, 11, 40, 0) 0%,
    rgba(80, 11, 40, 0.8) 70%,
    #e21c34 120%
  );
}

.home__overlay {
  background: linear-gradient(
    rgba(80, 11, 40, 0) 0%,
    rgba(80, 11, 40, 0.44) 75%,
    #e21c34 130%
  );
  pointer-events: none;
}

.title__strikethrough {
  position: absolute;
  bottom: 54px;
  right: 48px;
}
</style>