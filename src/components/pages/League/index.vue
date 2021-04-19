<template>
  <div v-if="leagueContext" class="flex flex-col mx-40">
    <router-link
      class="mt-4 mb-1 underline txt-body text-pink"
      :to="{
        name: 'league-home',
        params: { leagueId: leagueContext.leagueId },
      }"
    >
      {{ leagueContext.leagueName }}
    </router-link>

    <router-view :leagueContext="leagueContext" />
  </div>
</template>

<script lang="ts">
  import { useQuery, useResult } from "@vue/apollo-composable";
  import gql from "graphql-tag";
  import { defineComponent } from "vue";
  import { useRoute } from "vue-router";

  type TLeagueResult = {
    league: {
      id: string;
      name: string;
      isShareable: boolean;
      inviteLink?: string;
      season: {
        id: string;
        currentWeekNumber: number;
        isComplete: boolean;
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
        isCommissioner: boolean;
      };
    };
  };

  type TLeagueVariables = {
    id: string;
  };

  const League = defineComponent({
    setup() {
      const route = useRoute();

      const {
        params: { leagueId },
      } = route;

      const { result } = useQuery<TLeagueResult, TLeagueVariables>(
        gql`
          query League($id: ID!) {
            league(id: $id) {
              id
              name
              isShareable
              inviteLink
              season {
                id
                currentWeekNumber
                isComplete
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
                isCommissioner
              }
            }
          }
        `,
        { id: leagueId as string }
      );

      const leagueContext = useResult(result, null, (data) => ({
        leagueId: data.league.id,
        leagueName: data.league.name,
        isShareable: data.league.isShareable,
        inviteLink: data.league.inviteLink,
        leagueMemberId: data.league.myLeagueMember?.id,
        isCommissioner: data.league.myLeagueMember?.isCommissioner ?? false,
        seasonId: data.league.season.id,
        weekNumber: data.league.season.currentWeekNumber,
        isComplete: data.league.season.isComplete,
        currentSeasonWeekId: data.league.season.currentSeasonWeek.id,
        lineupSpotsAvailable: data.league.season.currentSeasonWeek.lineupSpotsAvailable,
        previousSeasonWeekId: data.league.season.previousSeasonWeek?.id,
      }));

      return {
        leagueContext,
      };
    },
  });

  export default League;
</script>
