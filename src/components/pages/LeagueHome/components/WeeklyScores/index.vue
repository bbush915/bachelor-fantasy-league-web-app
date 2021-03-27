<template>
  <div class="relative py-8 bg-gray-dark rounded-xl">
    <h2 class="pl-8 mb-8">Week {{ weekNumber }} Scores</h2>

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
      :selectedSeasonWeekId="seasonWeekId"
      :selectedLeagueMemberId="leagueContext.leagueMemberId"
      :condensed="true"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from "vue";

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

  setup(props) {
    const { leagueContext } = toRefs(props);

    const {
      previousSeasonWeekId,
      currentSeasonWeekId,
      weekNumber: weekNumber_,
      isComplete,
    } = leagueContext.value;

    const weekNumber = computed(() => {
      if (isComplete) {
        return weekNumber_;
      }

      return Math.max(weekNumber_ - 1, 1);
    });

    const seasonWeekId = computed(() => (isComplete ? currentSeasonWeekId : previousSeasonWeekId));

    return {
      weekNumber,
      seasonWeekId,
    };
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
