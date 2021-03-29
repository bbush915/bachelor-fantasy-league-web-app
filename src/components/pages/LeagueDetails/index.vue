<template>
  <div class="flex flex-col">
    <h1 class="mb-10">League Details</h1>

    <div v-if="league" class="flex flex-col px-8 pt-6 pb-8 mx-40 bg-gray-dark rounded-xl">
      <div class="flex justify-between mb-4">
        <h2>{{ league.name }}</h2>
        <router-link
          v-if="isCommissioner"
          class="flex items-center"
          :to="{
            name: 'edit-league',
          }"
        >
          <span class="mr-3 text-sm">Edit League Details</span>

          <div class="w-5 h-5 mb-0.5">
            <EditIcon />
          </div>
        </router-link>
      </div>

      <div class="flex space-x-4">
        <div class="flex-1">
          <div class="w-64 h-64 overflow-hidden rounded-xl">
            <img :src="league.logoUrl" />
          </div>

          <h2 class="my-4">Commissioner</h2>

          <div class="flex items-center">
            <Avatar class="w-16 h-16 mr-4" :src="commissioner.user.avatarUrl" />

            <span>{{ commissioner.user.displayName }}</span>
          </div>

          <h2 class="my-4">About</h2>

          <p>{{ league.description }}</p>
        </div>

        <div class="flex-1">
          <h2 class="mb-4">League Members ({{ leagueMembers.length }})</h2>

          <ScrollContainer class="px-4 py-2 bg-gray rounded-xl league-member-list">
            <div
              v-for="leagueMember in leagueMembers"
              :key="leagueMember.id"
              class="flex items-center my-2"
            >
              <Avatar class="w-16 h-16 mr-4" :src="leagueMember.user.avatarUrl" />

              <span>{{ leagueMember.user.displayName }}</span>
            </div>
          </ScrollContainer>
        </div>
      </div>

      <div v-if="isAuthenticated" class="self-end mt-8">
        <div v-if="league.myLeagueMember?.isActive" class="flex space-x-4">
          <button
            v-if="league.myLeagueMember.id !== commissioner.id"
            class="btn-secondary"
            @click="handleQuitLeagueClick"
          >
            Quit League
          </button>

          <button class="btn-primary">Invite Friends</button>
        </div>

        <button v-else class="btn-primary" @click="handleJoinLeagueClick">Join League</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useMutation, useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { computed, defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

import EditIcon from "@/assets/edit.svg";
import Avatar from "@/components/common/Avatar/index.vue";
import ScrollContainer from "@/components/common/ScrollContainer/index.vue";
import { useAuthentication } from "@/composables";

type TResult = {
  league: {
    id: string;
    name: string;
    description: string;
    logoUrl: string;
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

const LeagueDetails = defineComponent({
  name: "LeagueDetails",

  components: {
    Avatar,
    EditIcon,
    ScrollContainer,
  },

  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const { isAuthenticated } = useAuthentication();

    const {
      params: { leagueId },
    } = route;

    const { result } = useQuery<TResult>(
      gql`
        query LeagueDetails($leagueId: ID!) {
          league(id: $leagueId) {
            id
            name
            description
            logoUrl
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
      { leagueId },
      { errorPolicy: "all" }
    );

    const league = useResult(result, null, (data) => {
      return data.league;
    });

    const commissioner = computed(() => league.value?.leagueMembers.find((x) => x.isCommissioner));
    const isCommissioner = computed(() => league.value?.myLeagueMember?.isCommissioner);

    const leagueMembers = computed(
      () =>
        league.value?.leagueMembers
          .filter((x) => x.isActive)
          .sort((x, y) => x.user.displayName.localeCompare(y.user.displayName)) ?? []
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

    async function handleJoinLeagueClick() {
      await joinLeague({ input: { leagueId } });

      router.push({ name: "league-home", params: { leagueId } });

      store.dispatch("pushNotification", {
        type: "success",
        message: "Joined league successfully!",
      });
    }

    const { mutate: quitLeague } = useMutation(
      gql`
        mutation QuitLeague($input: QuitLeagueInput!) {
          quitLeague(input: $input) {
            id
          }
        }
      `
    );

    async function handleQuitLeagueClick() {
      await quitLeague({ input: { leagueId } });

      router.push({ name: "my-leagues" });

      store.dispatch("pushNotification", {
        type: "success",
        message: "Quit league successfully!",
      });
    }

    return {
      league,
      commissioner,
      isAuthenticated,
      isCommissioner,
      leagueMembers,
      handleJoinLeagueClick,
      handleQuitLeagueClick,
    };
  },
});

export default LeagueDetails;
</script>

<style scoped>
.league-member-list {
  max-height: 500px;
  overflow-y: auto;
}
</style>
