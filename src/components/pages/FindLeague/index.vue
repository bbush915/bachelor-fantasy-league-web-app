<template>
  <div class="flex flex-col mx-40">
    <h1 class="my-8">Find a League</h1>

    <div class="flex flex-col px-8 pt-6 pb-8 bg-gray-dark rounded-xl">
      <section class="mb-8">
        <h2 class="mb-2">Search</h2>

        <label for="league-name">League Name</label>

        <form class="flex items-center w-1/2" @submit.prevent>
          <Input
            id="league-name"
            class="flex-grow mr-3 input"
            type="text"
            v-model:value="searchQuery"
          />

          <button
            class="flex items-center justify-center w-10 h-10 rounded-full search-button bg-pink"
            type="submit"
            :disabled="!canSearch"
            @click="onSearchClick"
          >
            <SearchIcon />
          </button>
        </form>
      </section>

      <section>
        <h2>Search Results</h2>

        <div v-if="hasSearched" class="mt-2">
          <Loading v-if="loading" />

          <p v-else-if="leagues.length === 0">No results found.</p>

          <LeagueTable v-else :leagues="leagues" />
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
  import { useQuery, useResult } from "@vue/apollo-composable";
  import gql from "graphql-tag";
  import { computed, defineComponent, reactive, ref, watch } from "vue";

  import SearchIcon from "@/assets/search.svg";
  import Input from "@/components/common/Input/index.vue";
  import Loading from "@/components/common/Loading/index.vue";
  import LeagueTable from "./components/LeagueTable/index.vue";

  type TLeaguesResult = {
    leagues: {
      id: string;
      name: string;
      logoUrl: string;
      commissioner: {
        id: string;
        user: {
          id: string;
          displayName: string;
          avatarUrl: string;
        };
      };
      myLeagueMember: {
        id: string;
        isActive: boolean;
      };
    }[];
  };

  const FindLeague = defineComponent({
    components: {
      Input,
      LeagueTable,
      Loading,
      SearchIcon,
    },

    setup() {
      const searchQuery = ref<string>();
      const isSearchEnabled = ref(false);
      const hasSearched = ref(false);

      const canSearch = computed(() => (searchQuery.value?.length ?? 0) > 0);

      function onSearchClick() {
        isSearchEnabled.value = true;
        hasSearched.value = true;
      }

      const { result, loading } = useQuery<TLeaguesResult>(
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
                isActive
              }
            }
          }
        `,
        { query: searchQuery },
        reactive({
          enabled: isSearchEnabled,
        })
      );

      const leagues = useResult(result, [], (data) =>
        data.leagues.sort((x, y) => x.name.localeCompare(y.name))
      );

      watch(
        () => result.value,
        () => (isSearchEnabled.value = false)
      );

      return {
        searchQuery,
        canSearch,
        onSearchClick,
        hasSearched,
        loading,
        leagues,
      };
    },
  });

  export default FindLeague;
</script>

<style lang="postcss" scoped>
  .search-button:disabled {
    opacity: 0.5;
  }

  th {
    @apply font-medium text-sm;
  }
</style>
