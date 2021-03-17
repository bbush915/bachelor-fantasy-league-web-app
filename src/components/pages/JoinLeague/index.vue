<template>
  <div class="flex flex-col mx-40">
    <h1 class="my-8">Join a League</h1>
    <div class="flex flex-col px-8 pt-6 pb-8 bg-gray-dark rounded-xl">
      <h1 class="pb-2 text-lg">Search</h1>

      <label for="league-name" class="text-xs font-thin">League Name</label>

      <div class="flex items-center w-1/2">
        <input
          id="league-name"
          class="flex-grow mr-2 input"
          type="text"
          v-model="query"
        />

        <button
          class="flex items-center justify-center rounded-full w-9 h-9 bg-pink"
        >
          <SearchIcon />
        </button>
      </div>
      <h2 class="mt-8">Search Results</h2>
      <table class="table-fixed">
        <thead>
          <tr class="h-12">
            <th class="w-1/3 text-left">League Name</th>
            <th class="w-1/3 text-left">Commissioner</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr v-for="league in leagues" :key="league.id">
            <td>
              <div class="flex items-center my-2">
                <div class="overflow-hidden w-14 h-14 rounded-xl">
                  <img :src="league.logoUrl" />
                </div>
                <span class="ml-4">
                  {{ league.name }}
                </span>
              </div>
            </td>
            <td>
              <div class="flex items-center">
                <div class="overflow-hidden rounded-full w-14 h-14">
                  <img :src="league.commissioner.user.avatarUrl" />
                </div>
                <span class="ml-4">
                  {{ league.commissioner.user.displayName }}
                </span>
              </div>
            </td>
            <td>
              <div class="flex items-center">
                <button
                  class="btn-secondary"
                  @click="handleDetailsClick(league.id)"
                >
                  Details
                </button>
                <button
                  class="ml-4 btn-primary"
                  @click="handleJoinClick(league.id)"
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
import { defineComponent, ref } from 'vue';

import SearchIcon from '@/assets/search.svg';
import { useMutation, useQuery, useResult } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

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
  name: 'JoinLeague',
  setup() {
    const router = useRouter();
    const store = useStore();
    const query = ref<string>();
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
          }
        }
      `,
      { query: query }
    );
    const { mutate: joinLeague } = useMutation(
      gql`
        mutation JoinLeague($input: JoinLeagueInput!) {
          joinLeague(input: $input) {
            id
          }
        }
      `
    );
    const leagues = useResult(result, null, (data) => data.leagues);

    async function handleDetailsClick(leagueId: string): Promise<void> {
      router.push({ name: 'league-details', params: { leagueId } });
    }

    async function handleJoinClick(leagueId: string): Promise<void> {
      try {
        await joinLeague({
          input: {
            leagueId,
          },
        });

        store.dispatch('pushNotification', {
          type: 'success',
          message: 'Joined league successfuly!',
        });

        router.push({ name: 'league-home', params: { leagueId } });
      } catch (error) {
        store.dispatch('pushNotification', {
          type: 'error',
          message: error?.message ?? 'Failed to join league. Try again later',
        });
      }
      return;
    }
    return { leagues, query, handleJoinClick, handleDetailsClick };
  },
  components: {
    SearchIcon,
  },
});

export default JoinLeague;
</script>
<style lang="postcss" scoped>
th {
  @apply font-medium text-sm;
}
</style>
