<template>
  <div class="min-h-screen bg-gray-darkest">
    <Header />
    <Notifications />

    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Header from "@/components/common/Header/index.vue";
import Notifications from "@/components/common/Notifications/index.vue";

export default defineComponent({
  name: "App",

  components: {
    Header,
    Notifications,
  },
});
</script>
