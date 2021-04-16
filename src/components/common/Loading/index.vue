<template>
  <div class="flex flex-col items-center">
    <div class="w-16 h-16 animated-rose">
      <RoseIcon />
    </div>

    <span class="mt-4">Loading...</span>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  import RoseIcon from "@/assets/rose.svg";

  const Loading = defineComponent({
    components: {
      RoseIcon,
    },
  });

  export default Loading;
</script>
