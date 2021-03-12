<template>
  <div class="flex flex-col items-center pt-6 pb-8">
    <div class="flex flex-col self-start mb-6 ml-40">
      <h1 class="text-3xl">League Home</h1>
    </div>

    <div class="flex flex-col w-3/5 space-y-6">
      <Lineup :weekNumber="leagueContext.currentSeasonWeekNumber" :lineup="lineup" />
      <Leaderboard />

      <div class="flex w-full space-x-6">
        <WeeklyScores class="w-1/2" />
        <ContestantScores class="w-1/2" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { defineComponent, PropType } from "vue";

import { LeagueContext } from "@/types";
import ContestantScores from "./ContestantScores/index.vue";
import Leaderboard from "./Leaderboard/index.vue";
import Lineup from "./Lineup/index.vue";
import WeeklyScores from "./WeeklyScores/index.vue";

const LeagueHome = defineComponent({
  name: "LeagueHome",

  components: {
    ContestantScores,
    Leaderboard,
    Lineup,
    WeeklyScores,
  },

  props: {
    leagueContext: {
      type: Object as PropType<LeagueContext>,
      required: true,
    },
  },

  setup({ leagueContext }) {
    const { result } = useQuery(
      gql`
        query LeagueHome($leagueId: String!, $seasonWeekId: String!) {
          myLineup(leagueId: $leagueId, seasonWeekId: $seasonWeekId) {
            id
            lineupContestants {
              contestant {
                id
                name
                headshotUrl
              }
            }
          }
        }
      `,
      {
        leagueId: leagueContext.leagueId,
        seasonWeekId: leagueContext.currentSeasonWeekId,
      },
      {
        fetchPolicy: "no-cache",
      }
    );

    const lineup = useResult(result, null, (data) => data.myLineup);

    return {
      lineup,
    };
  },
});

export default LeagueHome;
</script>
