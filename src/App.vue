<template>
  <div class="bg-gray-darkest">
    <Header v-if="showHeader" />
    <Notifications />

    <ScrollContainer
      class="scroll-container"
      :style="{
        'max-height': `calc(100vh - ${showHeader ? '88px' : '0px'})`,
      }"
    >
      <router-view
        :style="{
          'min-height': `calc(100vh - ${showHeader ? '88px' : '0px'})`,
        }"
      />
      <Footer v-if="showHeader" />
    </ScrollContainer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRoute } from "vue-router";

import Header from "@/components/common/Header/index.vue";
import Footer from "@/components/common/Footer/index.vue";
import Notifications from "@/components/common/Notifications/index.vue";
import ScrollContainer from "@/components/common/ScrollContainer/index.vue";

export default defineComponent({
  name: "App",

  components: {
    Header,
    Footer,
    Notifications,
    ScrollContainer,
  },

  setup() {
    const route = useRoute();

    const showHeader = computed(() => route.path !== "/");

    return {
      showHeader,
    };
  },
});
</script>
