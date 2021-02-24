<template>
  <div class="steam-overlay fixed h-full w-full pointer-events-none" />
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
    rgba(80, 11, 40, 0) 0%,
    rgba(80, 11, 40, 0.44) 75%,
    #e21c34 130%
  );
}
</style>