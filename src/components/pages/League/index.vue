<template>
  <div v-if="leagueContext" class="flex flex-col mx-40">
    <div class="mt-4 mb-2">
      <router-link
        class="underline txt-body text-pink"
        :to="{ name: 'league-home', params: { leagueId: leagueContext.leagueId } }"
      >
        {{ leagueContext.leagueName }}
      </router-link>
    </div>

    <router-view :leagueContext="leagueContext" />
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
        lineupSpotsAvailable: number;
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
    const route = useRoute();

    const {
      params: { leagueId },
    } = route;

    const { result } = useQuery<TResult>(
      gql`
        query League($id: ID!) {
          league(id: $id) {
            id
            name
            season {
              id
              currentWeekNumber
              currentSeasonWeek {
                id
                lineupSpotsAvailable
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
      lineupSpotsAvailable: data.league.season.currentSeasonWeek.lineupSpotsAvailable,
      previousSeasonWeekId: data.league.season.previousSeasonWeek?.id,
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
