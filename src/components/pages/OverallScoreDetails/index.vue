<template>
  <div class="flex flex-col">
    <div class="flex items-center justify-between w-full mb-10">
      <h1>Leaderboard Details</h1>

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

    <div class="mb-8 ml-40">
      <div class="pb-8 txt-body">Leaderboard</div>

      <div v-if="leagueMembers" class="py-4 bg-gray-dark rounded-xl">
        <div class="pr-8 mt-8">
          <transition-group name="member-list">
            <div
              v-for="leagueMember in leagueMembers"
              :key="leagueMember.userId"
              class="flex items-center justify-between h-10 pl-8 pr-4 my-8 member"
              :style="{ width: `${leagueMember.normalizedWidth}%` }"
            >
              <div class="flex items-center">
                <span class="w-8 txt-body">{{ leagueMember.ordinal }}</span>

                <div class="w-16 h-16 mx-6 overflow-hidden rounded-full">
                  <img :src="leagueMember.avatarUrl" />
                </div>

                <span class="txt-body">
                  {{ leagueMember.userId === userId ? "You" : leagueMember.displayName }}
                </span>
              </div>

              <span class="txt-body">{{ leagueMember.score }}</span>
            </div>
          </transition-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from "vue";

import { useOverallLeaderboard, useSeasonWeeks } from "@/composables";
import { LeagueContext } from "@/types";

const OverallScoreDetails = defineComponent({
  name: "OverallScoreDetails",

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
    const { leagueMembers } = useOverallLeaderboard(leagueId, selectedWeekNumber);

    const filteredSeasonWeeks = computed(
      () => seasonWeeks.value?.filter((x) => x.weekNumber < currentWeekNumber) ?? []
    );

    return {
      filteredSeasonWeeks,
      selectedWeekNumber,
      userId,
      leagueMembers,
    };
  },
});

export default OverallScoreDetails;
</script>

<style scoped>
.member-list-move {
  transition: transform 1s ease;
}

.member {
  background: linear-gradient(270deg, rgba(226, 28, 52, 0.85) -10%, rgba(226, 28, 52, 0.1) 130%);
}

select {
  background: transparent;
}
</style>
