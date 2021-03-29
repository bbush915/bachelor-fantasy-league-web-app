<template>
  <div class="flex flex-col mx-40 my-8">
    <h1 class="mb-8">My Fantasy Leagues</h1>

    <div class="flex flex-col px-8 py-6 mx-40 bg-gray-dark rounded-xl">
      <h2 class="mb-8">Current Season</h2>

      <div class="flex flex-col">
        <div v-if="leagues.length > 0">
          <LeagueTable class="w-full" :leagues="leagues" :isLocked="isLocked" />
        </div>

        <div v-else class="flex flex-col items-center">
          <div class="w-16 h-16 mb-8">
            <RoseIcon />
          </div>

          <p class="w-2/3 mb-8 text-center txt-body">
            You are not a member of any fantasy leagues! Search for a league to join or create a new
            league to get started.
          </p>

          <div class="flex flex-col items-center">
            <router-link class="mb-6 w-52 btn-primary" to="/join-league">Join a League</router-link>
            <router-link class="w-52 btn-primary" to="/create-league">Create a League</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { computed, defineComponent, reactive } from "vue";

import RoseIcon from "@/assets/rose.svg";
import { useCurrentSeasonWeek } from "@/composables";
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
  name: "MyLeagues",

  components: {
    LeagueTable,
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

    const { result } = useQuery<TResult>(
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
      isLocked,
    };
  },
});

export default MyLeagues;
</script>
