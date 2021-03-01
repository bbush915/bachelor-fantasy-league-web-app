<template>
  <div class="fixed w-full h-full pointer-events-none gradient-overlay" />
</template>

<script lang="ts">
import { defineComponent } from "vue";

const SteamOverlay = defineComponent({
  name: "GradientOverlay",
});

export default SteamOverlay;
</script>

<style scoped>
.gradient-overlay {
  background: linear-gradient(
    rgba(80, 11, 40, 0) 0%,
    rgba(80, 11, 40, 0.8) 70%,
    #e21c34 120%
  );
}
</style>