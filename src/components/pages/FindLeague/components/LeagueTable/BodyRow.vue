<template>
  <tr>
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
        <Avatar class="w-14 h-14" :src="commissioner.avatarUrl" />

        <span class="ml-4">
          {{ commissioner.displayName }}
        </span>
      </div>
    </td>

    <td>
      <div class="flex items-center">
        <router-link
          class="btn-secondary"
          :to="{
            name: 'league-details',
            params: { leagueId: league.id },
          }"
        >
          Details
        </router-link>

        <button
          v-if="isAuthenticated && !league.myLeagueMember"
          class="ml-4 btn-primary"
          @click="onJoinLeagueClick(league.id)"
        >
          Join League
        </button>
      </div>
    </td>
  </tr>
</template>

<script lang="ts">
  import { useAuthentication } from "@/composables";
  import { useMutation } from "@vue/apollo-composable";
  import gql from "graphql-tag";
  import { defineComponent, toRefs } from "vue";
  import { useRouter } from "vue-router";
  import { useStore } from "vuex";

  import Avatar from "@/components/common/Avatar/index.vue";

  type TJoinLeagueResult = { joinLeague: { id: string } };
  type TJoinLeagueVariables = { input: { leagueId: string } };

  const BodyRow = defineComponent({
    name: "BodyRow",

    components: {
      Avatar,
    },

    props: {
      league: {
        type: Object,
        required: true,
      },
    },

    setup(props) {
      const { league } = toRefs(props);

      const store = useStore();
      const router = useRouter();

      const { isAuthenticated } = useAuthentication();

      const { mutate: joinLeague } = useMutation<TJoinLeagueResult, TJoinLeagueVariables>(
        gql`
          mutation JoinLeague($input: JoinLeagueInput!) {
            joinLeague(input: $input) {
              id
            }
          }
        `
      );

      async function onJoinLeagueClick(leagueId: string) {
        const { data } = await joinLeague({
          input: {
            leagueId,
          },
        });

        if (data) {
          store.dispatch("pushNotification", {
            type: "success",
            message: "Joined league successfuly!",
          });

          router.push({ name: "league-home", params: { leagueId } });
        } else {
          store.dispatch("pushNotification", {
            type: "error",
            message: "Failed to join league. Please try again later",
          });
        }
      }

      return {
        commissioner: league.value.commissioner.user,
        isAuthenticated,
        onJoinLeagueClick,
      };
    },
  });

  export default BodyRow;
</script>
