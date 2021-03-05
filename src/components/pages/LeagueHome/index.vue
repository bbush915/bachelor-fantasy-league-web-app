<template>
  <div class="flex flex-col items-center pt-6 pb-8">
    <div class="flex flex-col self-start mb-6 ml-40">
      <span class="mb-1 text-sm font-thin text-pink">
        {{ league?.name ?? "" }}
      </span>

      <h1 class="text-3xl">League Home</h1>
    </div>

    <div class="flex flex-col w-3/5 space-y-6">
      <Lineup v-if="seasonWeek" :seasonWeek="seasonWeek" :lineup="lineup" />
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
import { computed, defineComponent } from "vue";
import { useRoute } from "vue-router";

import ContestantScores from "./ContestantScores/index.vue";
import Leaderboard from "./Leaderboard/index.vue";
import Lineup from "./Lineup/index.vue";
import MemberScores from "./MemberScores/index.vue";

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

    const { result } = useQuery(
      gql`
        query LeagueHome($leagueId: String!) {
          league(id: $leagueId) {
            id
            name
            season {
              id
              currentSeasonWeek {
                id
                weekNumber
              }
            }
          }
          currentLineup(leagueId: $leagueId) {
            id
            lineupContestants {
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
        leagueId: route.params.leagueId,
      },
      {
        fetchPolicy: "no-cache",
      }
    );

    const league = useResult(result, null, (data) => data.league);
    const lineup = useResult(result, null, (data) => data.currentLineup);

    const seasonWeek = computed(() => league.value?.season.currentSeasonWeek);

    return {
      league,
      seasonWeek,
      lineup,
    };
  },
});

export default LeagueHome;
</script>