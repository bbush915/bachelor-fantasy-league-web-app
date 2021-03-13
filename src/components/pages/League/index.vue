<template>
  <div v-if="leagueContext" class="flex flex-col px-40">
    <span class="mt-4 mb-2 text-sm font-light text-pink">
      {{ leagueContext.leagueName }}
    </span>

    <router-view v-if="leagueContext" :leagueContext="leagueContext" />
  </div>
</template>

<script lang="ts">
import { useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { defineComponent } from "vue";
import { useRoute } from "vue-router";

type TResult = {
  league: {
    id: string;
    name: string;
    season: {
      id: string;
      currentWeekNumber: number;
      currentSeasonWeek: {
        id: string;
      };
      previousSeasonWeek: {
        id: string;
      };
    };
    myLeagueMember: {
      id: string;
    };
  };
};

const League = defineComponent({
  name: "League",

  setup() {
    const {
      params: { leagueId },
    } = useRoute();

    const { result } = useQuery<TResult>(
      gql`
        query League($id: String!) {
          league(id: $id) {
            id
            name
            season {
              id
              currentWeekNumber
              currentSeasonWeek {
                id
              }
              previousSeasonWeek {
                id
                weekNumber
              }
            }
            myLeagueMember {
              id
            }
          }
        }
      `,
      { id: leagueId }
    );

    const leagueContext = useResult(result, null, (data) => ({
      seasonId: data.league.season.id,
      weekNumber: data.league.season.currentWeekNumber,
      currentSeasonWeekId: data.league.season.currentSeasonWeek.id,
      previousSeasonWeekId: data.league.season.previousSeasonWeek.id,
      leagueId: data.league.id,
      leagueName: data.league.name,
      leagueMemberId: data.league.myLeagueMember.id,
    }));

    return {
      leagueContext,
    };
  },
});

export default League;
</script>
