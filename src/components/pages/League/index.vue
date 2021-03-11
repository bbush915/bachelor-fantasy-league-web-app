<template>
  <div v-if="leagueContext" class="flex flex-col px-40">
    <span class="mt-4 mb-2 text-sm font-light text-pink">
      {{ leagueContext.name }}
    </span>

    <router-view :leagueContext="leagueContext" />
  </div>
</template>

<script lang="ts">
import { useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { defineComponent } from "vue";
import { useRoute } from "vue-router";

import { LeagueContext } from "@/types";

const League = defineComponent({
  name: "League",

  setup() {
    const {
      params: { leagueId },
    } = useRoute();

    const { result } = useQuery(
      gql`
        query League($id: String!) {
          league(id: $id) {
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
        }
      `,
      { id: leagueId }
    );

    const leagueContext = useResult<any, null, LeagueContext>(result, null, (data) => ({
      id: data.league.id,
      name: data.league.name,
      seasonId: data.league.season.id,
      currentSeasonWeekId: data.league.season.currentSeasonWeek.id,
      currentSeasonWeekNumber: data.league.season.currentSeasonWeek.weekNumber,
    }));

    return {
      leagueContext,
    };
  },
});

export default League;
</script>
