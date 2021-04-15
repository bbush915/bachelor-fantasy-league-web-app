<template>
  <div class="relative pt-8 bg-gray-dark rounded-xl">
    <h2 class="pl-8 mb-4">League Winners</h2>

    <div class="flex justify-center space-x-10">
      <Podium v-if="medalists[1]" :place="2" :leaderboardEntry="medalists[1]" />
      <Podium v-if="medalists[0]" :place="1" :leaderboardEntry="medalists[0]" />
      <Podium v-if="medalists[2]" :place="3" :leaderboardEntry="medalists[2]" />
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, PropType, ref, toRefs } from "vue";

  import { useOverallLeaderboard } from "@/composables";
  import { LeagueContext } from "@/types";
  import Podium from "./components/Podium/index.vue";

  const FinalStandings = defineComponent({
    name: "FinalStandings",

    components: {
      Podium,
    },

    props: {
      leagueContext: {
        type: Object as PropType<LeagueContext>,
        required: true,
      },
    },

    setup(props) {
      const { leagueContext } = toRefs(props);
      const { leagueId, currentSeasonWeekId } = leagueContext.value;

      const { leaderboardEntries } = useOverallLeaderboard(leagueId, ref(currentSeasonWeekId));

      const medalists = computed(() => leaderboardEntries.value.slice(0, 3));

      return {
        medalists,
      };
    },
  });

  export default FinalStandings;
</script>
