<template>
  <div class="flex justify-end p-1 root txt-label">
    <div v-if="timeRemaining" class="flex">
      <span class="mr-1">Lineup locks in</span>

      <div v-if="timeRemaining.days > 0" class="flex mr-1">
        <span class="mr-0.5">{{ timeRemaining.days }}</span>
        <span>days</span>
      </div>

      <div v-if="timeRemaining.hours > 0" class="flex mr-1">
        <span class="mr-0.5">{{ timeRemaining.hours }}</span>
        <span>hrs</span>
      </div>

      <div v-if="timeRemaining.minutes > 0" class="flex mr-1">
        <span class="mr-0.5">{{ timeRemaining.minutes }}</span>
        <span>min</span>
      </div>

      <span class="mr-0.5">{{ timeRemaining.seconds }}</span>
      <span>sec</span>
    </div>

    <span v-else>Lineups are locked for this week</span>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, ref, onMounted, onUnmounted } from "vue";

  import { useActiveSeason } from "@/composables";

  const EpisodeCountdown = defineComponent({
    setup() {
      const { activeSeason } = useActiveSeason();

      const now = ref(new Date());
      const interval = ref<number>();

      const timeRemaining = computed(() => {
        if (!activeSeason.value?.currentSeasonWeek) {
          return null;
        }

        const episodeAirDate = new Date(activeSeason.value.currentSeasonWeek.episodeAirDate);

        if (episodeAirDate < now.value) {
          return null;
        }

        const difference = Math.floor((episodeAirDate.getTime() - now.value.getTime()) / 1000);

        return {
          seconds: difference % 60,
          minutes: Math.floor(difference / 60) % 60,
          hours: Math.floor(difference / 3600) % 24,
          days: Math.floor(difference / 86400),
        };
      });

      onMounted(() => {
        interval.value = window.setInterval(() => (now.value = new Date()), 1000);
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
    min-width: 400px;
  }
</style>
