<template>
  <div class="overflow-hidden rounded-full">
    <img v-if="src" :src="src" />
    <DefaultAvatar v-else />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import DefaultAvatar from "@/assets/default-avatar.svg";

const Avatar = defineComponent({
  name: "Avatar",

  components: {
    DefaultAvatar,
  },

  props: {
    src: {
      type: String,
      required: false,
    },
  },
});

export default Avatar;
</script>
