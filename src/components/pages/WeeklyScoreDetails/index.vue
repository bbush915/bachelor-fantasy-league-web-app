<template>
  <div class="flex flex-col">
    <div class="flex items-center justify-between w-full mb-10">
      <h1>Weekly Score Details</h1>

      <select v-model="selectedWeekNumber" class="font-light w-28">
        <option disabled>Select Week Number</option>
        <option
          v-for="seasonWeek in filteredSeasonWeeks"
          :key="seasonWeek.id"
          :value="seasonWeek.weekNumber"
        >
          Week {{ seasonWeek.weekNumber }}
        </option>
      </select>
    </div>

    <div class="flex justify-center px-40 space-x-8">
      <div class="w-1/2">
        <div class="pb-8 txt-body">Week {{ selectedWeekNumber }} Scores</div>

        <div class="py-4 bg-gray-dark rounded-xl">
          <button
            v-for="leagueMember in leagueMembers"
            :key="leagueMember.id"
            :class="{ selected: selectedUserId === leagueMember.userId }"
            class="flex items-center justify-between w-full px-8 py-1 league-member"
            @click="selectedUserId = leagueMember.userId"
          >
            <div class="flex items-center">
              <span class="w-8">{{ leagueMember.ordinal }}</span>

              <div class="w-16 h-16 mx-6 overflow-hidden rounded-full">
                <img :src="leagueMember.avatarUrl" />
              </div>

              <span>
                {{ leagueMember.userId === userId ? "You" : leagueMember.displayName }}
              </span>
            </div>

            <span>
              {{ leagueMember.score }}
            </span>
          </button>
        </div>
      </div>

      <div v-if="selectedLeagueMember" class="w-1/2">
        <div class="pb-8 txt-body">Your Week {{ selectedWeekNumber }} Lineup</div>

        <div class="px-8 py-4 mb-8 bg-gray-dark rounded-xl">
          <div
            v-for="lineupContestant in selectedLeagueMember.lineup"
            :key="lineupContestant.id"
            class="flex items-center justify-between py-1"
          >
            <div class="flex items-center">
              <div class="w-16 h-16 mr-6 overflow-hidden rounded-full">
                <img :src="lineupContestant.headshotUrl" />
              </div>

              <span class="txt-body">
                {{ lineupContestant.name }}
              </span>
            </div>

            <span class="txt-body">
              {{ lineupContestant.score }}
            </span>
          </div>
        </div>

        <div class="flex items-center justify-between px-8 py-4 bg-gray-dark rounded-xl">
          <h2>Week {{ selectedWeekNumber }} Score</h2>

          <h2 class="text-pink">
            {{ selectedLeagueMember.score }}
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from "vue";

import { useSeasonWeeks, useWeeklyLeaderboard } from "@/composables";
import { LeagueContext } from "@/types";

const WeeklyScoreDetails = defineComponent({
  name: "WeeklyScoreDetails",

  props: {
    leagueContext: {
      type: Object as PropType<LeagueContext>,
      required: true,
    },
  },

  setup({ leagueContext }) {
    const { userId, leagueId, seasonId, currentWeekNumber } = leagueContext;

    const selectedWeekNumber = ref(currentWeekNumber - 1);

    const { seasonWeeks } = useSeasonWeeks(seasonId);

    const filteredSeasonWeeks = computed(
      () => seasonWeeks.value?.filter((x) => x.weekNumber < currentWeekNumber) ?? []
    );

    const selectedSeasonWeekId = computed(
      () => filteredSeasonWeeks.value.find((x) => x.weekNumber === selectedWeekNumber.value)?.id
    );

    const { leagueMembers } = useWeeklyLeaderboard(leagueId, selectedSeasonWeekId);

    const selectedUserId = ref(userId);

    const selectedLeagueMember = computed(() =>
      leagueMembers.value.find((x) => x.userId === selectedUserId.value)
    );

    return {
      filteredSeasonWeeks,
      selectedWeekNumber,
      userId,
      leagueMembers,
      selectedUserId,
      selectedLeagueMember,
    };
  },
});

export default WeeklyScoreDetails;
</script>

<style lang="postcss" scoped>
select {
  background: transparent;
}

.league-member {
  @apply font-light text-sm;

  &.selected {
    @apply bg-gray-darkest font-semibold;
  }
}
</style>
