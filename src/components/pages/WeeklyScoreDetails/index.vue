<template>
  <div class="flex flex-col">
    <div class="flex items-center justify-between w-full mb-10">
      <h1>Weekly Score Details</h1>

      <select v-model="selectedWeekNumber" class="w-28">
        <option disabled>Select Week Number</option>
        <option v-for="{ id, weekNumber } in seasonWeeks" :key="id" :value="weekNumber">
          Week {{ weekNumber }}
        </option>
      </select>
    </div>

    <div class="flex justify-center px-40 space-x-8">
      <div class="flex-1">
        <div class="pb-8 txt-body">Week {{ selectedWeekNumber }} Scores</div>

        <div class="py-4 bg-gray-dark rounded-xl">
          <WeeklyLeaderboard
            :leagueContext="leagueContext"
            :selectedSeasonWeekId="selectedSeasonWeekId"
            v-model:selectedLeagueMemberId="selectedLeagueMemberId"
          />
        </div>
      </div>

      <div v-if="selectedLeagueMemberId" class="flex-1">
        <div class="pb-8 txt-body">Week {{ selectedWeekNumber }} Lineup</div>

        <div class="py-4 bg-gray-dark rounded-xl">
          <Lineup
            :selectedLeagueMemberId="selectedLeagueMemberId"
            :selectedSeasonWeekId="selectedSeasonWeekId"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, toRefs } from "vue";

import WeeklyLeaderboard from "@/components/common/WeeklyLeaderboard/index.vue";
import { useSeasonWeeks } from "@/composables";
import { LeagueContext } from "@/types";
import Lineup from "./components/Lineup.vue";

const WeeklyScoreDetails = defineComponent({
  name: "WeeklyScoreDetails",

  components: {
    Lineup,
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
    const { leagueMemberId, seasonId, weekNumber } = leagueContext.value;

    const { seasonWeeks } = useSeasonWeeks(seasonId);

    const filteredSeasonWeeks = computed(() =>
      seasonWeeks.value.filter((x) => x.weekNumber < weekNumber)
    );

    const selectedWeekNumber = ref(weekNumber - 1);

    const selectedSeasonWeekId = computed(
      () => filteredSeasonWeeks.value.find((x) => x.weekNumber === selectedWeekNumber.value)?.id
    );

    const selectedLeagueMemberId = ref(leagueMemberId);

    return {
      seasonWeeks: filteredSeasonWeeks,
      selectedWeekNumber,
      selectedSeasonWeekId,
      selectedLeagueMemberId,
    };
  },
});

export default WeeklyScoreDetails;
</script>

<style lang="postcss" scoped>
select {
  background: transparent;
}
</style>
