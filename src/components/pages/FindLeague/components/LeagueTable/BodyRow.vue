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
            name: 'league-info',
            params: { leagueId: league.id },
          }"
        >
          More Info
        </router-link>

        <button
          v-if="isAuthenticated.value && !!!league.myLeagueMember?.isActive"
          class="ml-4 btn-primary"
          @click="onJoinLeagueClick"
        >
          Join League
        </button>
      </div>
    </td>
  </tr>
</template>

<script lang="ts">
  import { useAuthentication, useJoinLeague } from "@/composables";
  import { defineComponent, toRefs } from "vue";
  import { useRouter } from "vue-router";

  import Avatar from "@/components/common/Avatar/index.vue";

  const BodyRow = defineComponent({
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

      const router = useRouter();

      const { isAuthenticated } = useAuthentication();

      const { joinLeague } = useJoinLeague(league.value.id);

      function onJoinLeagueClick() {
        const callback = () => {
          router.push({ name: "league-home", params: { leagueId: league.value.id } });
        };

        return joinLeague(callback);
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
