<template>
  <div class="flex flex-col">
    <div class="flex items-center justify-between w-full mb-10">
      <h1>Contestant Score Breakdown</h1>

      <select v-model="selectedWeekNumber" class="w-28">
        <option disabled>Select Week Number</option>
        <option v-for="{ id, weekNumber } in seasonWeeks" :key="id" :value="weekNumber">
          Week {{ weekNumber }}
        </option>
      </select>
    </div>

    <ScoreTable :seasonWeekContestants="seasonWeekContestants" :weekNumber="selectedWeekNumber" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, toRefs } from "vue";

import { useSeasonWeekContestants, useSeasonWeeks } from "@/composables";
import { LeagueContext } from "@/types";
import ScoreTable from "./components/ScoreTable/index.vue";

const ContestantScoreDetails = defineComponent({
  name: "ContestantScoreDetails",

  components: {
    ScoreTable,
  },

  props: {
    leagueContext: {
      type: Object as PropType<LeagueContext>,
      required: true,
    },
  },

  setup(props) {
    const { leagueContext } = toRefs(props);
    const { seasonId, weekNumber } = leagueContext.value;

    const { seasonWeeks } = useSeasonWeeks(seasonId);

    const filteredSeasonWeeks = computed(() =>
      seasonWeeks.value.filter((x) => x.weekNumber < weekNumber)
    );

    const selectedWeekNumber = ref(weekNumber - 1);

    const selectedSeasonWeekId = computed(
      () => filteredSeasonWeeks.value.find((x) => x.weekNumber === selectedWeekNumber.value)?.id
    );

    const { seasonWeekContestants } = useSeasonWeekContestants(selectedSeasonWeekId);

    return {
      seasonWeeks: filteredSeasonWeeks,
      selectedWeekNumber,
      seasonWeekContestants,
    };
  },
});

export default ContestantScoreDetails;
</script>

<style scoped>
select {
  background: transparent;
}
</style>
