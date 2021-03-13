<template>
  <div class="relative py-8 bg-gray-dark rounded-xl">
    <h2 class="pl-8 mb-8">Top Week {{ leagueContext.weekNumber - 1 }} Contestants</h2>

    <router-link class="absolute top-8 right-8" :to="{ name: 'contestant-score-details' }">
      <MoreIcon />
    </router-link>

    <div
      v-for="contestant in contestants"
      :key="contestant.id"
      class="flex items-center justify-between w-full px-8 py-1"
    >
      <div class="flex items-center">
        <span class="w-8 txt-body">{{ contestant.ordinal }}</span>

        <div class="w-16 h-16 mx-6 overflow-hidden rounded-full">
          <img :src="contestant.headshotUrl" />
        </div>

        <span class="txt-body">
          {{ contestant.name }}
        </span>
      </div>

      <span class="txt-body">
        {{ contestant.score }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, toRefs } from "vue";

import MoreIcon from "@/assets/more.svg";
import { useSeasonWeekContestants } from "@/composables";
import { LeagueContext } from "@/types";
import { getOrdinal } from "@/utils";

const ContestantScores = defineComponent({
  name: "ContestantScores",

  components: {
    MoreIcon,
  },

  props: {
    leagueContext: {
      type: Object as PropType<LeagueContext>,
      required: true,
    },
  },

  setup(props) {
    const { leagueContext } = toRefs(props);
    const { previousSeasonWeekId } = leagueContext.value;

    const { seasonWeekContestants } = useSeasonWeekContestants(ref(previousSeasonWeekId));

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
      contestants,
    };
  },
});

export default ContestantScores;
</script>
