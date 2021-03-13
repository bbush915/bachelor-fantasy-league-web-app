<template>
  <div class="flex flex-col">
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
        <OverallLeaderboard :leagueContext="leagueContext" :weekNumber="selectedWeekNumber" />
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
    const { seasonId, weekNumber } = leagueContext.value;

    const { seasonWeeks } = useSeasonWeeks(seasonId);

    const filteredSeasonWeeks = computed(
      () => seasonWeeks.value?.filter((x) => x.weekNumber < weekNumber) ?? []
    );

    const selectedWeekNumber = ref(weekNumber - 1);

    return {
      seasonWeeks: filteredSeasonWeeks,
      selectedWeekNumber,
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
