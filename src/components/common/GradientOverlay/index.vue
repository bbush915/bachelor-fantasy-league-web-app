<template>
  <div class="fixed w-full h-full pointer-events-none gradient-overlay" />
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  const GradientOverlay = defineComponent({});

  export default GradientOverlay;
</script>

<style scoped>
  .gradient-overlay {
    background: linear-gradient(
      rgba(0, 0, 0, 0) 0%,
      rgba(80, 11, 40, 0.8) 70%,
      rgba(226, 28, 52, 1) 120%
    );
  }
</style>
