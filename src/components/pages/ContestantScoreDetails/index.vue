<template>
  <div class="flex flex-col mb-8">
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
      const { seasonId, weekNumber, isComplete } = leagueContext.value;

      const { seasonWeeks } = useSeasonWeeks(seasonId);

      const selectedWeekNumber = ref(weekNumber - (isComplete ? 0 : 1));

      const filteredSeasonWeeks = computed(
        () =>
          seasonWeeks.value?.filter((x) => x.weekNumber < weekNumber + (isComplete ? 1 : 0)) ?? []
      );

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
