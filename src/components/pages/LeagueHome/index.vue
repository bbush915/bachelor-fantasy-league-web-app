<template>
  <div class="flex flex-col items-center">
    <div class="self-start ml-40">
      <h1 class="mb-6 text-3xl">League Home</h1>
    </div>

    <div class="flex flex-col w-3/5 mb-8 space-y-6">
      <Lineup :lineup="currentLineup" />
      <Leaderboard />

      <div class="flex w-full space-x-6">
        <MemberScores class="w-1/2" />
        <ContestantScores class="w-1/2" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { defineComponent } from "vue";
import { useRoute } from "vue-router";

import ContestantScores from "./ContestantScores/index.vue";
import Leaderboard from "./Leaderboard/index.vue";
import MemberScores from "./MemberScores/index.vue";
import Lineup from "./Lineup/index.vue";

const LeagueHome = defineComponent({
  name: "LeagueHome",

  components: {
    ContestantScores,
    Leaderboard,
    Lineup,
    MemberScores,
  },

  setup() {
    const route = useRoute();

    const leagueId = route.params.id;

    const { result } = useQuery(
      gql`
        query LeaagueHome($leagueId: String!) {
          currentLineup(leagueId: $leagueId) {
            id
            lineupContestants {
              id
              contestant {
                id
                name
                imageUrl
              }
            }
          }
        }
      `,
      {
        leagueId,
      }
    );

    const currentLineup = useResult(result, null, (data) => data.currentLineup);

    return {
      currentLineup,
    };
  },
});

export default LeagueHome;
</script>