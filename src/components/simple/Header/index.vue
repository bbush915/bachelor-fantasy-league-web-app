<template>
  <div
    v-if="show"
    class="sticky top-0 z-30 flex items-center w-full px-12 py-3 header bg-gray-dark"
  >
    <div class="w-24">
      <router-link to="/">
        <Logo />
      </router-link>
    </div>

    <div class="flex items-center flex-grow ml-32 space-x-20">
      <HeaderLink v-for="link in links" :key="link.content" :to="link.to" :content="link.content" />
    </div>

    <div v-if="isAuthenticated">
      <span
        >Welcome, <span class="text-pink">{{ username }}</span>
      </span>
    </div>
    <div v-else class="flex items-center">
      <router-link class="mr-5" to="/login">Log in</router-link>

      <router-link
        class="flex items-center justify-center w-32 rounded-full h-9 bg-pink text-gray-darkest"
        to="/registration"
      >
        Sign up
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { computed, defineComponent, ref, watch } from "vue";
import { useRoute } from "vue-router";

import Logo from "@/assets/logo.svg";
import HeaderLink from "./HeaderLink.vue";
import { useStore } from "vuex";

const links = [
  { to: "/about", content: "How it works" },
  { to: "/contestants", content: "Contestants" },
];

const authenticatedLinks = [
  { to: "/my-leagues", content: "My Fantasy Leagues" },
  { to: "/join-league", content: "Join a League" },
  { to: "/create-league", content: "Create a League" },
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

    watch(
      () => route.path,
      () => {
        show.value = route.path !== "/";
      }
    );

    const store = useStore();

    const isAuthenticated = computed(() => !!store.state.token);

    const { result, refetch } = useQuery(
      gql`
        query Me {
          me {
            username
          }
        }
      `
    );

    const username = useResult(result, null, (data) => data.me.username);

    watch(
      () => isAuthenticated,
      () => {
        refetch();
      }
    );

    const show = ref(false);

    return {
      show,
      isAuthenticated,
      username,
      links: isAuthenticated.value ? authenticatedLinks : links,
    };
  },
});

export default Header;
</script>

<style scoped>
.header {
  box-shadow: 0 0 8px black;
}
</style>
