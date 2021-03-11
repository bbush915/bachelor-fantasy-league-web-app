<template>
  <div class="flex flex-col">
    <div class="flex items-center justify-between w-full mb-10">
      <h1 class="text-3xl font-light">Leaderboard Details</h1>

      <select v-model="selectedSeasonWeekId" class="font-light w-28">
        <option disabled>Select Week Number</option>
        <option
          v-for="seasonWeek in filteredSeasonWeeks"
          :key="seasonWeek.id"
          :value="seasonWeek.id"
        >
          Week {{ seasonWeek.weekNumber }}
        </option>
      </select>
    </div>

    <div class="mb-8 ml-40">
      <p class="pb-2 font-light">Leaderboard</p>

      <div class="py-4 bg-gray-dark rounded-xl">
        <div class="pr-8 mt-8 font-thin">
          <div
            v-for="(member, index) in members"
            :key="index"
            class="flex items-center h-10 pl-8 pr-4 my-8 member"
            :style="{ width: `${member.width}%` }"
          >
            <span class="w-7">{{ member.place }}</span>
            <div class="w-16 h-16 ml-5 overflow-hidden rounded-full">
              <img :src="member.profile_url" />
            </div>
            <span class="ml-5">{{ member.name }}</span>
            <div class="flex-grow" />
            <span>{{ member.score }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { computed, defineComponent, PropType, ref } from "vue";

import { useSeasonWeeks } from "@/composables";
import { LeagueContext } from "@/types";
import { getOrdinal } from "@/utils";

const LeaderboardDetails = defineComponent({
  name: "LeaderboardDetails",

  props: {
    leagueContext: {
      type: Object as PropType<LeagueContext>,
      required: true,
    },
  },

  setup({ leagueContext }) {
    const { id: leagueId, seasonId, currentSeasonWeekId, currentSeasonWeekNumber } = leagueContext;

    const selectedSeasonWeekId = ref(currentSeasonWeekId);

    const { seasonWeeks } = useSeasonWeeks(seasonId);

    const filteredSeasonWeeks = computed(
      () => seasonWeeks.value?.filter((x) => x.weekNumber <= currentSeasonWeekNumber) ?? []
    );

    const { result } = useQuery(
      gql`
        query Leaderboard($leagueId: String!, $seasonWeekId: String!) {
          leaderboard(leagueId: $leagueId, seasonWeekId: $seasonWeekId) {
            id
            leagueMember {
              id
              user {
                id
                username
                avatarUrl
              }
            }
            weeklyScore
          }
        }
      `,
      { leagueId, seasonWeekId: selectedSeasonWeekId }
    );

    const members = useResult<any, [], any[]>(result, [], (data) => {
      const minScore = Math.min(...data.leaderboard.map((x: any) => x.weeklyScore));
      const maxScore = Math.max(...data.leaderboard.map((x: any) => x.weeklyScore));

      return data.leaderboard.map((x: any, index: number) => ({
        place: getOrdinal(index + 1),
        name: x.leagueMember.user.username,
        profile_url: x.leagueMember.user.avatarUrl,
        score: x.weeklyScore,
        width: getWidth(minScore, maxScore, x.weeklyScore),
      }));
    });

    function getWidth(min: number, max: number, value: number): number {
      return (0.33 + 0.67 * ((value - min) / (max - min))) * 100;
    }

    return {
      members,
      filteredSeasonWeeks,
      selectedSeasonWeekId,
    };
  },
});

export default LeaderboardDetails;
</script>

<style scoped>
.member {
  background: linear-gradient(270deg, rgba(226, 28, 52, 0.85) -10%, rgba(226, 28, 52, 0.1) 130%);
}

select {
  background: transparent;
}
</style>
