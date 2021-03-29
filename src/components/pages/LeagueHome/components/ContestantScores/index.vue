<template>
  <div class="relative py-8 bg-gray-dark rounded-xl">
    <h2 class="pl-8 mb-8">Top Week {{ weekNumber }} Contestants</h2>

    <router-link
      v-if="leagueContext.previousSeasonWeekId"
      class="absolute top-8 right-8"
      :to="{ name: 'contestant-score-details' }"
    >
      <MoreIcon />
    </router-link>

    <div v-if="!leagueContext.previousSeasonWeekId" class="relative mx-8">
      <PlaceholderIcon />

      <span class="absolute txt-body placeholder-text">
        Contestant Scores will become available<br />
        once Week 1 is scored.
      </span>
    </div>

    <div v-if="leagueContext.previousSeasonWeekId">
      <div
        v-for="contestant in contestants"
        :key="contestant.id"
        class="flex items-center justify-between w-full px-8 py-1"
      >
        <div class="flex items-center">
          <span class="w-8 txt-body">{{ contestant.ordinal }}</span>

          <Avatar class="w-16 h-16 mx-6" :src="contestant.headshotUrl" />

          <span class="txt-body">
            {{ contestant.name }}
          </span>
        </div>

        <span class="txt-body">
          {{ contestant.score }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, toRefs } from "vue";

import MoreIcon from "@/assets/more.svg";
import PlaceholderIcon from "@/assets/placeholder.svg";
import Avatar from "@/components/common/Avatar/index.vue";
import { useSeasonWeekContestants } from "@/composables";
import { LeagueContext } from "@/types";
import { getOrdinal } from "@/utils";

const ContestantScores = defineComponent({
  name: "ContestantScores",

  components: {
    Avatar,
    MoreIcon,
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

    const {
      previousSeasonWeekId,
      currentSeasonWeekId,
      weekNumber: weekNumber_,
      isComplete,
    } = leagueContext.value;

    const { seasonWeekContestants } = useSeasonWeekContestants(
      ref(isComplete ? currentSeasonWeekId : previousSeasonWeekId)
    );

    const weekNumber = computed(() => {
      if (isComplete) {
        return weekNumber_;
      }

      return Math.max(weekNumber_ - 1, 1);
    });

    const contestants = computed(() => {
      const scores = seasonWeekContestants.value
        .map((seasonWeekContestants) => seasonWeekContestants.score)
        .sort((x, y) => y - x);

      return seasonWeekContestants.value
        .slice(0)
        .sort((x, y) => {
          const scoreComparison = y.score - x.score;

          if (scoreComparison === 0) {
            return x.contestant.name.localeCompare(y.contestant.name);
          } else {
            return scoreComparison;
          }
        })
        .slice(0, 3)
        .map((seasonWeekContestant) => ({
          id: seasonWeekContestant.id,
          name: seasonWeekContestant.contestant.name,
          ordinal: getOrdinal(scores.findIndex((x) => x === seasonWeekContestant.score) + 1),
          headshotUrl: seasonWeekContestant.contestant.headshotUrl,
          score: seasonWeekContestant.score,
        }));
    });

    return {
      weekNumber,
      contestants,
    };
  },
});

export default ContestantScores;
</script>

<style scoped>
.placeholder-text {
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}
</style>
