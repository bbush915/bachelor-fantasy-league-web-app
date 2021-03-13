<template>
  <div class="relative py-8 bg-gray-dark rounded-xl">
    <h2 class="pl-8 mb-8">Week {{ leagueContext.weekNumber - 1 }} Scores</h2>

    <router-link class="absolute top-8 right-8" :to="{ name: 'weekly-score-details' }">
      <MoreIcon />
    </router-link>

    <WeeklyLeaderboard
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
import WeeklyLeaderboard from "@/components/common/WeeklyLeaderboard/index.vue";
import { LeagueContext } from "@/types";

const WeeklyScores = defineComponent({
  name: "WeeklyScores",

  components: {
    MoreIcon,
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
