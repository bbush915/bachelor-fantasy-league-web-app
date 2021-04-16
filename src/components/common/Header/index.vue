<template>
  <div class="sticky top-0 z-10 flex w-full header bg-gray-dark">
    <div class="self-center w-24 ml-12">
      <router-link to="/">
        <Logo />
      </router-link>
    </div>

    <div class="flex items-center flex-1 ml-32 space-x-20">
      <Link v-for="link in links" :key="link.content" :to="link.to" :content="link.content" />
    </div>

    <div v-if="isAuthenticated" class="relative flex flex-col justify-center">
      <span class="mr-16 text-right txt-body">
        Welcome,
        <router-link class="text-pink" to="/profile">{{ displayName }}</router-link>
      </span>

      <EpisodeCountdown class="absolute bottom-0 right-0 pl-8 pr-16" />
    </div>

    <div v-else class="flex items-center mr-12">
      <router-link class="mr-5 text-sm font-thin" to="/login">Log in</router-link>

      <router-link
        class="flex items-center justify-center w-32 text-sm rounded-full h-9 bg-pink text-gray-darkest"
        :to="{ name: 'registration' }"
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

  import Logo from "@/assets/logo.svg";
  import { useAuthentication } from "@/composables";
  import EpisodeCountdown from "./components/EpisodeCountdown/index.vue";
  import Link from "./components/Link/index.vue";

  const publicLinks = [
    { to: "/about", content: "How it works" },
    { to: "/find-league", content: "Find a League" },
    { to: "/contestants", content: "Contestants" },
  ];

  const authenticatedLinks = [
    { to: "/my-leagues", content: "My Fantasy Leagues" },
    { to: "/about", content: "How it works" },
    { to: "/find-league", content: "Find a League" },
    { to: "/create-league", content: "Create a League" },
    { to: "/contestants", content: "Contestants" },
  ];

  const Header = defineComponent({
    components: {
      EpisodeCountdown,
      Link,
      Logo,
    },

    setup() {
      const { isAuthenticated } = useAuthentication();

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
