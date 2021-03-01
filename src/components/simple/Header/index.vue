<template>
  <div
    v-if="show"
    class="sticky top-0 z-30 flex w-full px-12 py-3 bg-gray-dark"
  >
    <div class="w-24">
      <router-link to="/">
        <Logo />
      </router-link>
    </div>

    <div class="flex items-center flex-grow ml-32 space-x-20">
      <HeaderLink
        v-for="(link, index) in links"
        :key="index"
        :to="link.to"
        :content="link.content"
      />
    </div>

    <div class="flex items-center">
      <router-link class="mr-5" to="/">Log in</router-link>

      <button class="w-32 rounded-full h-9 bg-pink text-gray-darkest">
        Sign up
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import Logo from '@/assets/logo.svg';
import HeaderLink from './HeaderLink.vue';

const links = [
  { to: '/about', content: 'How it works' },
  { to: '/join-league', content: 'Join a League' },
  { to: '/contestants', content: 'Contestants' },
];

const Header = defineComponent({
  name: 'Header',

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
        show.value = route.path !== '/';
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
