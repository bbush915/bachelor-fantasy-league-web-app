<template>
  <section class="flex flex-col px-8 pb-8 bg-gray-dark rounded-xl">
    <div class="flex justify-between mt-6 mb-4">
      <h2>League Details</h2>

      <router-link
        v-if="canEdit"
        class="flex items-center"
        :to="{
          name: 'edit-league',
        }"
      >
        <span class="mr-2 txt-label">Edit League Details</span>

        <div class="w-5 h-5 mb-0.5">
          <EditIcon />
        </div>
      </router-link>
    </div>

    <label class="mb-1">Name</label>
    <span class="mb-4 txt-body">{{ league.name }}</span>

    <label class="mb-1">Description</label>
    <span class="mb-4 txt-body">{{ league.description }}</span>

    <label class="mb-2">League Image</label>
    <div class="w-64 h-64 mb-4 overflow-hidden rounded-xl">
      <img :src="league.logoUrl" />
    </div>

    <label class="mb-2">Commissioner</label>
    <div class="flex items-center">
      <Avatar class="w-16 h-16 mr-4" :src="league.commissioner.avatarUrl" />
      <span class="txt-body">{{ league.commissioner.displayName }}</span>
    </div>

    <div v-if="isAuthenticated" class="flex self-end mt-8 space-x-4">
      <button v-if="canJoinLeague" class="btn-primary" @click="onJoinLeagueClick">
        Join League
      </button>

      <button v-if="canQuitLeague" class="btn-secondary" @click="showQuitLeagueConfirmationModal">
        Quit League
      </button>

      <button v-if="canShareLeague" class="btn-primary" @click="onShareLeagueClick">
        Copy Invite Link
      </button>
    </div>

    <ConfirmationModal
      v-if="isQuitLeagueConfirmationModalVisible"
      :onConfirm="handleQuitLeague"
      :onClose="hideQuitLeagueConfirmationModal"
      message="Are you sure you want to quit this league?"
    />
  </section>
</template>

<script lang="ts">
  import { computed, defineComponent, PropType, toRefs } from "vue";
  import { useRouter } from "vue-router";

  import EditIcon from "@/assets/edit.svg";
  import Avatar from "@/components/common/Avatar/index.vue";
  import ConfirmationModal from "@/components/common/ConfirmationModal/index.vue";
  import { useAuthentication, useJoinLeague, useQuitLeague, useShareLeague } from "@/composables";

  type TLeague = {
    id: string;
    name: string;
    description: string;
    logoUrl: string;
    isShareable: boolean;
    inviteLink?: string;
    commissioner: {
      id: string;
      avatarUrl?: string;
      displayName: string;
    };
    myLeagueMember?: {
      id: string;
      isActive: boolean;
      isCommissioner: boolean;
    };
  };

  const LeagueDetails = defineComponent({
    components: {
      Avatar,
      ConfirmationModal,
      EditIcon,
    },

    props: {
      league: {
        type: Object as PropType<TLeague>,
        required: true,
      },

      canEdit: {
        type: Boolean,
        required: true,
      },
    },

    setup(props) {
      const { league } = toRefs(props);

      const router = useRouter();

      const { isAuthenticated } = useAuthentication();

      const canJoinLeague = computed(
        () => isAuthenticated.value && !!!league.value.myLeagueMember?.isActive
      );

      const { joinLeague } = useJoinLeague(league.value.id);

      function onJoinLeagueClick() {
        const callback = () => {
          router.push({ name: "league-home", params: { leagueId: league.value.id } });
        };

        return joinLeague(callback);
      }

      const canQuitLeague = computed(
        () =>
          isAuthenticated.value &&
          !!league.value.myLeagueMember?.isActive &&
          !league.value.myLeagueMember.isCommissioner
      );

      const {
        isQuitLeagueConfirmationModalVisible,
        showQuitLeagueConfirmationModal,
        hideQuitLeagueConfirmationModal,
        quitLeague,
      } = useQuitLeague(league.value.id);

      function handleQuitLeague() {
        const callback = () => {
          router.push({ name: "my-leagues" });
        };

        return quitLeague(callback);
      }

      const canShareLeague = computed(
        () =>
          isAuthenticated.value &&
          !!league.value.myLeagueMember?.isActive &&
          (league.value.isShareable || !!league.value.myLeagueMember?.isCommissioner)
      );

      const { copyInviteLink } = useShareLeague(league.value.inviteLink);

      return {
        isAuthenticated,
        canJoinLeague,
        onJoinLeagueClick,
        canQuitLeague,
        isQuitLeagueConfirmationModalVisible,
        showQuitLeagueConfirmationModal,
        hideQuitLeagueConfirmationModal,
        handleQuitLeague,
        canShareLeague,
        onShareLeagueClick: copyInviteLink,
      };
    },
  });

  export default LeagueDetails;
</script>
