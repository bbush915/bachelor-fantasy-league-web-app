<template>
  <div class="min-h-screen flex flex-col bg-gray-darkest">
    <Header />
    <router-view class="flex-grow" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Header from "@/components/simple/Header/index.vue";

export default defineComponent({
  name: "App",

  components: {
    Header,
  },
});
</script>