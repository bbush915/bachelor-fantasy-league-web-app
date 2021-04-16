<template>
  <div class="flex flex-col">
    <h1 class="mb-8">Edit League Members</h1>

    <section class="flex flex-col w-1/2 px-8 pb-8 mx-auto bg-gray-dark rounded-xl">
      <h2 class="mt-6 mb-4">League Members</h2>

      <ScrollContainer class="px-4 py-2 bg-gray rounded-xl edit-league-members__list">
        <div
          v-for="leagueMember in leagueMembers"
          :key="leagueMember.id"
          class="flex flex-row items-center justify-between pr-2 my-2"
        >
          <div class="flex flex-row items-center">
            <Avatar class="w-16 h-16 mr-4" :src="leagueMember.avatarUrl" />
            <span>{{ leagueMember.displayName }}</span>
          </div>

          <button
            v-if="!leagueMember.isCommissioner"
            class="btn-secondary"
            @click="showRemoveConfirmationModal(leagueMember)"
          >
            Remove
          </button>
        </div>
      </ScrollContainer>
    </section>

    <ConfirmationModal
      v-if="isRemoveConfirmationModalVisible"
      :onConfirm="() => handleRemoveLeagueMember(selectedLeagueMember.id)"
      :onClose="hideRemoveConfirmationModal"
      :message="`Are you sure you want to remove ${selectedLeagueMember.displayName} from this league?`"
    />
  </div>
</template>

<script lang="ts">
  import { useMutation, useQuery, useResult } from "@vue/apollo-composable";
  import gql from "graphql-tag";
  import { defineComponent, PropType, ref, toRefs } from "vue";
  import { useStore } from "vuex";

  import EditIcon from "@/assets/edit.svg";
  import Avatar from "@/components/common/Avatar/index.vue";
  import ConfirmationModal from "@/components/common/ConfirmationModal/index.vue";
  import ScrollContainer from "@/components/common/ScrollContainer/index.vue";
  import { useConfirmationModal } from "@/composables";
  import { LeagueContext } from "@/types";

  type TLeagueMembersResult = {
    league: {
      id: string;
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
    };
  };

  type TLeagueMembersVariables = { leagueId: string };

  type TLeagueMember = {
    id: string;
    avatarUrl: string;
    displayName: string;
    isCommissioner: boolean;
  };

  type TRemoveLeagueMemberResult = { removeLeagueMember: { id: string } };
  type TRemoveLeagueMemberVariables = { input: { leagueMemberId: string } };

  const EditLeagueMembers = defineComponent({
    components: {
      Avatar,
      EditIcon,
      ScrollContainer,
      ConfirmationModal,
    },

    props: {
      leagueContext: {
        type: Object as PropType<LeagueContext>,
        required: true,
      },
    },

    setup(props) {
      const { leagueContext } = toRefs(props);
      const { leagueId } = leagueContext.value;

      const { result, refetch } = useQuery<TLeagueMembersResult, TLeagueMembersVariables>(
        gql`
          query LeagueMembers($leagueId: ID!) {
            league(id: $leagueId) {
              id
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
            }
          }
        `,
        { leagueId }
      );

      const leagueMembers = useResult<TLeagueMembersResult, TLeagueMember[], TLeagueMember[]>(
        result,
        [],
        (data) =>
          data.league.leagueMembers
            .filter((x) => x.isActive)
            .map((x) => ({
              id: x.id,
              avatarUrl: x.user.avatarUrl,
              displayName: x.user.displayName,
              isCommissioner: x.isCommissioner,
            }))
            .sort((x, y) => x.displayName.localeCompare(y.displayName))
      );

      const {
        isConfirmationModalVisible,
        showConfirmationModal,
        hideConfirmationModal,
      } = useConfirmationModal();

      const selectedLeagueMember = ref<TLeagueMember | null>(null);

      function showRemoveConfirmationModal(leagueMember: TLeagueMember) {
        selectedLeagueMember.value = leagueMember;
        showConfirmationModal();
      }

      function hideRemoveConfirmationModal() {
        selectedLeagueMember.value = null;
        hideConfirmationModal();
      }

      const { mutate: removeLeagueMember } = useMutation<
        TRemoveLeagueMemberResult,
        TRemoveLeagueMemberVariables
      >(
        gql`
          mutation RemoveLeagueMember($input: RemoveLeagueMemberInput!) {
            removeLeagueMember(input: $input) {
              id
            }
          }
        `
      );

      const store = useStore();

      async function handleRemoveLeagueMember(leagueMemberId: string) {
        const { data } = await removeLeagueMember({
          input: { leagueMemberId },
        });

        hideRemoveConfirmationModal();

        if (data) {
          store.dispatch("pushNotification", {
            type: "success",
            message: "League member removed successfully!",
          });

          refetch();
        } else {
          store.dispatch("pushNotification", {
            type: "error",
            message: "Failed to remove league member. Please try again later",
          });
        }
      }

      return {
        leagueMembers,
        handleRemoveLeagueMember,
        isRemoveConfirmationModalVisible: isConfirmationModalVisible,
        showRemoveConfirmationModal,
        hideRemoveConfirmationModal,
        selectedLeagueMember,
      };
    },
  });

  export default EditLeagueMembers;
</script>

<style scoped>
  .edit-league-members__list {
    max-height: 75vh;
    overflow-y: auto;
  }
</style>
