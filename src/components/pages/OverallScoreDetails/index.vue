<template>
  <div class="flex flex-col mb-8">
    <div class="flex items-center justify-between w-full mb-10">
      <h1>Leaderboard Details</h1>

      <select v-model="selectedWeekNumber" class="w-28">
        <option disabled>Select Week Number</option>
        <option v-for="{ id, weekNumber } in seasonWeeks" :key="id" :value="weekNumber">
          Week {{ weekNumber }}
        </option>
      </select>
    </div>

    <div class="ml-40">
      <div class="pb-8 txt-body">Leaderboard</div>

      <div class="bg-gray-dark rounded-xl">
        <OverallLeaderboard
          :leagueContext="leagueContext"
          :selectedSeasonWeekId="selectedSeasonWeekId"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, PropType, ref, toRefs } from "vue";

  import OverallLeaderboard from "@/components/common/OverallLeaderboard/index.vue";
  import { useSeasonWeeks } from "@/composables";
  import { LeagueContext } from "@/types";

  const OverallScoreDetails = defineComponent({
    name: "OverallScoreDetails",

    components: {
      OverallLeaderboard,
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

      return {
        seasonWeeks: filteredSeasonWeeks,
        selectedWeekNumber,
        selectedSeasonWeekId,
        leagueContext,
      };
    },
  });

  export default OverallScoreDetails;
</script>

<style scoped>
  select {
    background: transparent;
  }
</style>
