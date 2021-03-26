<template>
  <div class="flex flex-col mx-40">
    <h1 class="my-8">Join a League</h1>

    <div class="flex flex-col px-8 pt-6 pb-8 bg-gray-dark rounded-xl">
      <h2 class="pb-4">Search</h2>

      <label for="league-name">League Name</label>

      <div class="flex items-center w-1/2">
        <Input
          id="league-name"
          class="flex-grow mr-2 input"
          type="text"
          v-model:value="searchQuery"
        />

        <button
          class="flex items-center justify-center w-10 h-10 rounded-full search-button bg-pink"
          :disabled="!canSearch"
          @click="handleSearchClick"
        >
          <SearchIcon />
        </button>
      </div>

      <h2 class="mt-8">Results</h2>

      <table v-if="leagues.length > 0" class="w-full">
        <thead>
          <tr class="h-12">
            <th class="text-left w-96">League</th>
            <th class="text-left w-96">Commissioner</th>
            <th />
          </tr>
        </thead>

        <tbody>
          <tr v-for="league in leagues" :key="league.id">
            <td>
              <div class="flex items-center my-2 space-x-4">
                <div class="overflow-hidden w-14 h-14 rounded-xl">
                  <img :src="league.logoUrl" />
                </div>

                <span>
                  {{ league.name }}
                </span>
              </div>
            </td>

            <td>
              <div class="flex items-center">
                <Avatar class="w-14 h-14" :src="league.commissioner.user.avatarUrl" />

                <span class="ml-4">
                  {{ league.commissioner.user.displayName }}
                </span>
              </div>
            </td>

            <td>
              <div class="flex items-center">
                <router-link
                  class="btn-secondary"
                  :to="{ name: 'league-details', params: { leagueId: league.id } }"
                >
                  Details
                </router-link>

                <button
                  v-if="isAuthenticated && !league.myLeagueMember"
                  class="ml-4 btn-primary"
                  @click="handleJoinLeagueClick(league.id)"
                >
                  Join League
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { useMutation, useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { computed, defineComponent, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import SearchIcon from "@/assets/search.svg";
import Avatar from "@/components/common/Avatar/index.vue";
import Input from "@/components/common/Input/index.vue";
import { useAuthentication } from "@/composables";

type TResult = {
  leagues: {
    id: string;
    name: string;
    logoUrl: string;
    commissioner: {
      id: string;
      displayName: string;
      avatarUrl: string;
    };
  }[];
};

const JoinLeague = defineComponent({
  name: "JoinLeague",

  components: {
    Avatar,
    Input,
    SearchIcon,
  },

  setup() {
    const router = useRouter();
    const store = useStore();

    const { isAuthenticated } = useAuthentication();

    const searchQuery = ref<string>();
    const isSearchEnabled = ref(false);

    const canSearch = computed(() => (searchQuery.value?.length ?? 0) > 0);

    const { result } = useQuery<TResult>(
      gql`
        query Leagues($query: String!) {
          leagues(query: $query) {
            id
            name
            logoUrl
            commissioner {
              id
              user {
                id
                displayName
                avatarUrl
              }
            }
            myLeagueMember {
              id
            }
          }
        }
      `,
      { query: searchQuery },
      reactive({
        enabled: isSearchEnabled,
        errorPolicy: "all",
      })
    );

    watch(
      () => result.value,
      () => (isSearchEnabled.value = false)
    );

    const leagues = useResult(result, [], (data) => data.leagues);

    const { mutate: joinLeague } = useMutation(
      gql`
        mutation JoinLeague($input: JoinLeagueInput!) {
          joinLeague(input: $input) {
            id
          }
        }
      `
    );

    async function handleJoinLeagueClick(leagueId: string) {
      try {
        await joinLeague({
          input: {
            leagueId,
          },
        });

        store.dispatch("pushNotification", {
          type: "success",
          message: "Joined league successfuly!",
        });

        router.push({ name: "league-home", params: { leagueId } });
      } catch (error) {
        store.dispatch("pushNotification", {
          type: "error",
          message: error?.message ?? "Failed to join league. Try again later",
        });
      }
    }

    function handleSearchClick() {
      isSearchEnabled.value = true;
    }

    return {
      leagues,
      searchQuery,
      canSearch,
      handleSearchClick,
      isAuthenticated,
      handleJoinLeagueClick,
    };
  },
});

export default JoinLeague;
</script>

<style lang="postcss" scoped>
.search-button:disabled {
  opacity: 0.5;
}

th {
  @apply font-medium text-sm;
}
</style>
