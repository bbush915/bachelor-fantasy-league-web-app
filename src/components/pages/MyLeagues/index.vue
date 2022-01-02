<template>
  <div class="flex flex-col mx-40 my-8">
    <h1 class="mb-8">My Fantasy Leagues</h1>

    <div class="flex flex-col px-8 py-6 mx-40 bg-gray-dark rounded-xl">
      <h2 class="mb-8">Current Season</h2>

      <Loading v-if="loading" />

      <div v-else class="flex flex-col">
        <div v-if="leagues.length === 0" class="flex flex-col items-center">
          <div class="w-16 h-16 mb-8 animated-rose">
            <RoseIcon />
          </div>

          <p class="w-1/2 mb-8 text-center txt-body">
            You are not a member of any fantasy leagues! To get started, find a league to join or
            create one of your own!
          </p>

          <div class="flex flex-col items-center">
            <router-link class="mb-6 w-52 btn-primary" to="/find-league">Find a League</router-link>
            <router-link class="w-52 btn-primary" to="/create-league">Create a League</router-link>
          </div>
        </div>

        <div v-else>
          <LeagueTable :leagues="leagues" :isLocked="isLocked" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { useQuery, useResult } from "@vue/apollo-composable";
  import gql from "graphql-tag";
  import { computed, defineComponent, reactive } from "vue";

  import RoseIcon from "@/assets/rose.svg?component";
  import { useCurrentSeasonWeek } from "@/composables";
  import Loading from "@/components/common/Loading/index.vue";
  import LeagueTable from "./components/LeagueTable/index.vue";

  type TResult = {
    myLeagues: {
      id: string;
      name: string;
      logoUrl: string;
      myLeagueMember: {
        id: string;
        isActive: boolean;
        isLineupSet: boolean;
      };
    }[];
  };

  const MyLeagues = defineComponent({
    components: {
      LeagueTable,
      Loading,
      RoseIcon,
    },

    setup() {
      const { currentSeasonWeek } = useCurrentSeasonWeek();

      const currentSeasonWeekId = computed(() => currentSeasonWeek.value?.id);
      const isQueryEnabled = computed(() => !!currentSeasonWeekId.value);
      const isLocked = computed(
        () =>
          currentSeasonWeek.value?.episodeAirDate &&
          new Date(currentSeasonWeek.value.episodeAirDate) < new Date()
      );

      const { result, loading } = useQuery<TResult>(
        gql`
          query MyLeagues($seasonWeekId: ID!) {
            myLeagues {
              id
              name
              logoUrl
              myLeagueMember {
                id
                isActive
                isLineupSet
                leagueMemberScore(seasonWeekId: $seasonWeekId) {
                  leagueMemberId
                  seasonWeekId
                  weeklyScore
                  weeklyRank
                  cumulativeScore
                  cumulativeRank
                }
              }
            }
          }
        `,
        { seasonWeekId: currentSeasonWeekId },
        reactive({ enabled: isQueryEnabled })
      );

      const leagues = useResult(result, [] as TResult["myLeagues"], (data) =>
        data.myLeagues
          .slice(0)
          .filter((x) => x.myLeagueMember.isActive)
          .sort((x, y) => x.name.localeCompare(y.name))
      );

      return {
        leagues,
        loading,
        isLocked,
      };
    },
  });

  export default MyLeagues;
</script>
