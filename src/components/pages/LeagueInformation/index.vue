<template>
  <section v-if="league" class="flex flex-col mx-40">
    <div class="mt-4 mb-8">
      <router-link
        v-if="showHomeLink"
        class="underline txt-body text-pink"
        :to="{
          name: 'league-home',
          params: { leagueId: league.id },
        }"
      >
        {{ league.name }}
      </router-link>

      <span v-else class="txt-body text-pink">{{ league.name }}</span>

      <h1 class="mt-1">League Information</h1>
    </div>

    <div class="flex flex-row mb-8 space-x-8">
      <LeagueDetails
        class="w-1/2 league-information__details"
        :league="league"
        :canEdit="isCommissioner"
      />

      <LeagueMembers
        class="w-1/2 league-information__members"
        :leagueMembers="leagueMembers"
        :canEdit="isCommissioner"
      />
    </div>
  </section>
</template>

<script lang="ts">
  import { useQuery, useResult } from "@vue/apollo-composable";
  import gql from "graphql-tag";
  import { computed, defineComponent } from "vue";
  import { useRoute } from "vue-router";

  import { useAuthentication } from "@/composables";
  import LeagueDetails from "./components/LeagueDetails/index.vue";
  import LeagueMembers from "./components/LeagueMembers/index.vue";

  type TLeagueInformationResult = {
    league: {
      id: string;
      name: string;
      description: string;
      logoUrl: string;
      isShareable: boolean;
      inviteLink?: string;
      leagueMembers: {
        id: string;
        isActive: boolean;
        isCommissioner: boolean;
        user: {
          id: string;
          displayName: string;
          avatarUrl: string;
        };
      }[];
      myLeagueMember: {
        id: string;
        isActive: boolean;
        isCommissioner: boolean;
      };
    };
  };

  type TLeagueInformationVariables = { leagueId: string };

  const LeagueInformation = defineComponent({
    components: {
      LeagueDetails,
      LeagueMembers,
    },

    setup() {
      const route = useRoute();

      const {
        params: { leagueId },
      } = route;

      const { result } = useQuery<TLeagueInformationResult, TLeagueInformationVariables>(
        gql`
          query LeagueInformation($leagueId: ID!) {
            league(id: $leagueId) {
              id
              name
              description
              logoUrl
              isShareable
              inviteLink
              leagueMembers {
                id
                isActive
                isCommissioner
                user {
                  id
                  displayName
                  avatarUrl
                }
              }
              myLeagueMember {
                id
                isActive
                isCommissioner
              }
            }
          }
        `,
        { leagueId: leagueId as string }
      );

      const league = useResult(result, null, (data) => {
        const league = data.league;
        const commissioner = league.leagueMembers.find((x) => x.isCommissioner)!;

        return {
          id: league.id,
          name: league.name,
          description: league.description,
          logoUrl: league.logoUrl,
          isShareable: league.isShareable,
          inviteLink: league.inviteLink,
          commissioner: {
            id: commissioner.id,
            avatarUrl: commissioner.user.avatarUrl,
            displayName: commissioner.user.displayName,
          },
          myLeagueMember: league.myLeagueMember,
        };
      });

      const leagueMembers = useResult(result, [], (data) =>
        data.league.leagueMembers
          .filter((x) => x.isActive)
          .map((x) => ({
            id: x.id,
            avatarUrl: x.user.avatarUrl,
            displayName: x.user.displayName,
          }))
          .sort((x, y) => x.displayName.localeCompare(y.displayName))
      );

      const isCommissioner = useResult(
        result,
        false,
        (data) => data.league.myLeagueMember.isCommissioner
      );

      const { isAuthenticated } = useAuthentication();

      const showHomeLink = computed(
        () => isAuthenticated.value && !!league.value?.myLeagueMember?.isActive
      );

      return {
        showHomeLink,
        league,
        leagueMembers,
        isCommissioner,
      };
    },
  });

  export default LeagueInformation;
</script>

<style scoped>
  .league-information__details,
  .league-information__members {
    height: fit-content;
  }
</style>
