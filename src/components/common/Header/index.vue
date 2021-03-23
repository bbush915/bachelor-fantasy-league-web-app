<template>
  <div class="sticky top-0 flex w-full header bg-gray-dark">
    <div class="self-center w-24 ml-12">
      <router-link to="/">
        <Logo />
      </router-link>
    </div>

    <div class="flex items-center flex-1 ml-32 space-x-20">
      <Link v-for="link in links" :key="link.content" :to="link.to" :content="link.content" />
    </div>

    <div v-if="isAuthenticated" class="flex flex-col items-end self-end">
      <span class="mb-2 mr-16 txt-body">
        Welcome, <router-link class="text-pink" to="/profile">{{ displayName }}</router-link>
      </span>

      <EpisodeCountdown class="pl-8 pr-16" />
    </div>

    <div v-else class="flex items-center mr-12">
      <router-link class="mr-5 text-sm font-thin" to="/login">Log in</router-link>

      <router-link
        class="flex items-center justify-center w-32 text-sm rounded-full h-9 bg-pink text-gray-darkest"
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
import { computed, defineComponent, watch } from "vue";
import { useStore } from "vuex";

import Logo from "@/assets/logo.svg";
import EpisodeCountdown from "./components/EpisodeCountdown/index.vue";
import Link from "./components/Link/index.vue";

const publicLinks = [
  { to: "/about", content: "How it works" },
  { to: "/join-league", content: "Join a League" },
  { to: "/contestants", content: "Contestants" },
];

const authenticatedLinks = [
  { to: "/my-leagues", content: "My Fantasy Leagues" },
  { to: "/join-league", content: "Join a League" },
  { to: "/create-league", content: "Create a League" },
  { to: "/about", content: "How it works" },
  { to: "/contestants", content: "Contestants" },
];

const Header = defineComponent({
  name: "Header",

  components: {
    EpisodeCountdown,
    Link,
    Logo,
  },

  setup() {
    const store = useStore();

    const isAuthenticated = computed(() => !!store.state.auth.token);
    const links = computed(() => (isAuthenticated.value ? authenticatedLinks : publicLinks));

    const { result, refetch } = useQuery(
      gql`
        query Me {
          me {
            id
            displayName
          }
        }
      `,
      {},
      { fetchPolicy: "no-cache" }
    );

    const displayName = useResult(result, null, (data) => data.me.displayName);

    watch(
      () => isAuthenticated.value,
      () => {
        refetch();
      }
    );

    return {
      isAuthenticated,
      displayName,
      links,
    };
  },
});

export default Header;
</script>

<style scoped>
.header {
  box-shadow: 0 0 8px black;
  height: 88px;
}
</style>
