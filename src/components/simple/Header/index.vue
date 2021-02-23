<template>
  <div v-if="show" class="w-full bg-gray-dark px-12 py-3 flex">
    <div class="w-24">
      <router-link to="/">
        <Logo />
      </router-link>
    </div>

    <div class="flex items-center ml-32 space-x-20 flex-grow">
      <HeaderLink
        v-for="(link, index) in links"
        :key="index"
        :to="link.to"
        :content="link.content"
      />
    </div>

    <div class="flex items-center">
      <router-link class="mr-5 text-white" to="/">Log in</router-link>

      <button class="w-32 h-9 bg-pink rounded-full">Sign up</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useRoute } from "vue-router";

import Logo from "@/assets/logo.svg";
import HeaderLink from "./HeaderLink.vue";

const links = [
  { to: "/about", content: "How it works" },
  { to: "/find-league", content: "Find a League" },
  { to: "/contestants", content: "Contestants" },
];

const Header = defineComponent({
  name: "Header",

  components: {
    HeaderLink,
    Logo,
  },

  setup() {
    const route = useRoute();
    const show = ref(false);

    watch(
      () => route.path,
      () => {
        show.value = route.path !== "/";
      }
    );

    return {
      show,
      links,
    };
  },
});

export default Header;
</script>