<template>
  <div class="relative pt-8 bg-gray-dark rounded-xl">
    <h2 class="pl-8">Leaderboard</h2>

    <router-link class="absolute top-8 right-8" :to="{ name: 'overall-score-details' }">
      <MoreIcon />
    </router-link>

    <OverallLeaderboard
      :leagueContext="leagueContext"
      :weekNumber="leagueContext.weekNumber - 1"
      :condensed="true"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import MoreIcon from "@/assets/more.svg";
import OverallLeaderboard from "@/components/common/OverallLeaderboard/index.vue";
import { LeagueContext } from "@/types";

const OverallScores = defineComponent({
  name: "OverallScores",

  components: {
    MoreIcon,
    OverallLeaderboard,
  },

  props: {
    leagueContext: {
      type: Object as PropType<LeagueContext>,
      required: true,
    },
  },
});

export default OverallScores;
</script>
