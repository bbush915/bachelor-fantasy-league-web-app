<template>
  <div class="relative pt-8 bg-gray-dark rounded-xl">
    <h2 class="pl-8">Leaderboard</h2>

    <router-link
      v-if="leagueContext.previousSeasonWeekId"
      class="absolute top-8 right-8"
      :to="{ name: 'overall-score-details' }"
    >
      <MoreIcon />
    </router-link>

    <div v-if="!leagueContext.previousSeasonWeekId" class="relative m-8">
      <div class="w-1/2">
        <PlaceholderIcon />
      </div>

      <span class="absolute txt-body placeholder-text">
        Leaderboard will become available<br />
        once Week 1 is scored.
      </span>
    </div>

    <OverallLeaderboard
      v-if="leagueContext.previousSeasonWeekId"
      :leagueContext="leagueContext"
      :selectedSeasonWeekId="seasonWeekId"
      :condensed="true"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from "vue";

import MoreIcon from "@/assets/more.svg";
import PlaceholderIcon from "@/assets/placeholder.svg";
import OverallLeaderboard from "@/components/common/OverallLeaderboard/index.vue";
import { LeagueContext } from "@/types";

const OverallScores = defineComponent({
  name: "OverallScores",

  components: {
    MoreIcon,
    OverallLeaderboard,
    PlaceholderIcon,
  },

  props: {
    leagueContext: {
      type: Object as PropType<LeagueContext>,
      required: true,
    },
  },

  setup(props) {
    const { leagueContext } = toRefs(props);
    const { previousSeasonWeekId, currentSeasonWeekId, isComplete } = leagueContext.value;

    const seasonWeekId = computed(() => (isComplete ? currentSeasonWeekId : previousSeasonWeekId));

    return {
      seasonWeekId,
    };
  },
});

export default OverallScores;
</script>

<style scoped>
.placeholder-text {
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}
</style>
