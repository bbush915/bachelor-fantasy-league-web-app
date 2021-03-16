<template>
  <div class="relative py-8 bg-gray-dark rounded-xl">
    <h2 class="pl-8 mb-8">Week {{ Math.max(leagueContext.weekNumber - 1, 1) }} Scores</h2>

    <router-link
      v-if="leagueContext.previousSeasonWeekId"
      class="absolute top-8 right-8"
      :to="{ name: 'weekly-score-details' }"
    >
      <MoreIcon />
    </router-link>

    <div v-if="!leagueContext.previousSeasonWeekId" class="relative mx-8">
      <PlaceholderIcon />

      <span class="absolute txt-body placeholder-text">
        Weekly Scores will become available<br />
        once Week 1 is scored.
      </span>
    </div>

    <WeeklyLeaderboard
      v-if="leagueContext.previousSeasonWeekId"
      :leagueContext="leagueContext"
      :selectedSeasonWeekId="leagueContext.previousSeasonWeekId"
      :selectedLeagueMemberId="leagueContext.leagueMemberId"
      :condensed="true"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import MoreIcon from "@/assets/more.svg";
import PlaceholderIcon from "@/assets/placeholder.svg";
import WeeklyLeaderboard from "@/components/common/WeeklyLeaderboard/index.vue";
import { LeagueContext } from "@/types";

const WeeklyScores = defineComponent({
  name: "WeeklyScores",

  components: {
    MoreIcon,
    PlaceholderIcon,
    WeeklyLeaderboard,
  },

  props: {
    leagueContext: {
      type: Object as PropType<LeagueContext>,
      required: true,
    },
  },
});

export default WeeklyScores;
</script>

<style scoped>
.placeholder-text {
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}
</style>
