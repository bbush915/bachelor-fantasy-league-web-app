<template>
  <div class="p-1 root">
    <label>
      {{ timeRemaining ? `Lineup locks in ${timeRemaining}` : "Lineup locked" }}
    </label>
  </div>
</template>

<script lang="ts">
import { formatDuration, intervalToDuration } from "date-fns";
import { computed, defineComponent, ref, onMounted, onUnmounted } from "vue";

import { useCurrentSeasonWeek } from "@/composables";

const EpisodeCountdown = defineComponent({
  name: "EpisodeCountdown",

  setup() {
    const { currentSeasonWeek } = useCurrentSeasonWeek();

    const now = ref(new Date());
    const interval = ref<number>();

    const timeRemaining = computed(() => {
      if (!currentSeasonWeek.value) {
        return null;
      }

      const episodeAirDate = new Date(currentSeasonWeek.value.episodeAirDate);

      if (episodeAirDate < now.value) {
        return null;
      }

      return formatDuration(
        intervalToDuration({
          start: new Date(),
          end: new Date(currentSeasonWeek.value.episodeAirDate),
        }),
        { format: ["years", "months", "days", "hours", "minutes"] }
      );
    });

    onMounted(() => {
      interval.value = window.setInterval(() => (now.value = new Date()), 60000);
    });

    onUnmounted(() => {
      window.clearInterval(interval.value);
    });

    return {
      timeRemaining,
    };
  },
});

export default EpisodeCountdown;
</script>

<style scoped>
.root {
  background: linear-gradient(270deg, rgba(226, 28, 52, 1) -5%, rgba(226, 28, 52, 0) 105%);
}
</style>
