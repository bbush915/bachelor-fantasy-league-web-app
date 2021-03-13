<template>
  <div class="fixed w-full h-full pointer-events-none steam-overlay" />
</template>

<script lang="ts">
import { defineComponent } from "vue";

const SteamOverlay = defineComponent({
  name: "SteamOverlay",
});

export default SteamOverlay;
</script>

<style scoped>
.steam-overlay {
  background: linear-gradient(
    rgba(0, 0, 0, 0) 0%,
    rgba(80, 11, 40, 0.45) 75%,
    rgba(226, 28, 52, 1) 130%
  );
}
</style>
