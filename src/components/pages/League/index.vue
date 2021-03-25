<template>
  <div v-if="leagueContext" class="flex flex-col mx-40">
    <div class="mt-4 mb-2">
      <router-link
        v-if="showHomeLink"
        class="underline txt-body text-pink"
        :to="{ name: 'league-home', params: { leagueId: leagueContext.leagueId } }"
      >
        {{ leagueContext.leagueName }}
      </router-link>

      <span v-else class="txt-body text-pink">{{ leagueContext.leagueName }}</span>
    </div>

    <router-view :leagueContext="leagueContext" />
  </div>
</template>

<script lang="ts">
import { useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { computed, defineComponent } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

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
    const store = useStore();

    const showHomeLink = computed(() => route.name !== "league-home" && store.state.auth.token);

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
      { id: leagueId },
      { errorPolicy: "all" }
    );

    const leagueContext = useResult(result, null, (data) => ({
      seasonId: data.league.season.id,
      weekNumber: data.league.season.currentWeekNumber,
      currentSeasonWeekId: data.league.season.currentSeasonWeek.id,
      lineupSpotsAvailable: data.league.season.currentSeasonWeek.lineupSpotsAvailable,
      previousSeasonWeekId: data.league.season.previousSeasonWeek?.id,
      leagueId: data.league.id,
      leagueName: data.league.name,
      leagueMemberId: data.league.myLeagueMember?.id,
    }));

    return {
      leagueContext,
      showHomeLink,
    };
  },
});

export default League;
</script>
