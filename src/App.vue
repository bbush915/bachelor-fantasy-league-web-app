<template>
  <div class="bg-gray-darkest">
    <Header v-if="showHeader" />
    <Notifications />

    <ScrollContainer
      class="scroll-container"
      :style="{ 'max-height': `calc(100vh - ${showHeader ? '96px' : '0px'})` }"
    >
      <router-view />
    </ScrollContainer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRoute } from "vue-router";

import Header from "@/components/common/Header/index.vue";
import Notifications from "@/components/common/Notifications/index.vue";
import ScrollContainer from "@/components/common/ScrollContainer/index.vue";

export default defineComponent({
  name: "App",

  components: {
    Header,
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

<style scoped></style>
