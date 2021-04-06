<template>
  <div class="flex flex-col items-center">
    <div class="w-16 h-16 rose">
      <RoseIcon />
    </div>

    <span class="mt-4">Loading...</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import RoseIcon from "@/assets/rose.svg";

const Loading = defineComponent({
  name: "Loading",

  components: {
    RoseIcon,
  },
});

export default Loading;
</script>

<style>
@keyframes rotation {
  0% {
    transform: rotate(50deg);
  }

  25% {
    transform: rotate(15deg);
  }

  75% {
    transform: rotate(85deg);
  }

  100% {
    transform: rotate(50deg);
  }
}

.rose {
  animation: rotation 2s infinite linear;
}
</style>
