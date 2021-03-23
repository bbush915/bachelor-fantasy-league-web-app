<template>
  <div>
    <router-link class="relative" :to="to">
      <LipstickSmear class="absolute link__lipstick-smear w-52" />
      <div class="text-sm">{{ content }}</div>
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import LipstickSmear from "@/assets/lipstick-smear.svg";

const Link = defineComponent({
  name: "Link",

  components: {
    LipstickSmear,
  },

  props: {
    to: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },
  },
});

export default Link;
</script>

<style lang="postcss" scoped>
.link__lipstick-smear {
  visibility: collapse;
  top: -18px;
  left: -18px;
}

.router-link-active {
  & .link__lipstick-smear {
    visibility: visible;
  }
}
</style>
