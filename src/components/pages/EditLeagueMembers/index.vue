<template>
  <div class="flex flex-col mx-40">
    <h1 class="my-8">Edit League Members</h1>

    <div class="flex flex-col px-8 pt-6 pb-8 mx-40 bg-gray-dark rounded-xl">
      <h2 class="mb-2">League Members</h2>
      <div class="flex-1">
        <ScrollContainer class="px-4 py-2 bg-gray rounded-xl league-member-list">
          <div
            v-for="leagueMember in leagueMembers"
            :key="leagueMember.id"
            class="flex flex-row items-center justify-between my-2"
          >
            <div class="flex flex-row items-center">
              <Avatar class="w-16 h-16 mr-4" :src="leagueMember.user.avatarUrl" />

              <span>{{ leagueMember.user.displayName }}</span>
            </div>
            <button
              v-if="!leagueMember.isCommissioner"
              class="btn-secondary"
              @click="showConfirmationModal(leagueMember)"
            >
              Remove
            </button>
          </div>
        </ScrollContainer>
      </div>
    </div>
    <ConfirmationModal
      v-if="isModalVisible"
      :onClose="hideConfirmationModal"
      :onConfirm="() => handleRemoveClick(selectedLeagueMember.id)"
      :message="`Are you sure you want to remove ${selectedLeagueMember.user.displayName} from this league?`"
    />
  </div>
</template>

<script lang="ts">
import { useMutation, useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { computed, defineComponent, PropType, ref, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

import EditIcon from "@/assets/edit.svg";
import Avatar from "@/components/common/Avatar/index.vue";
import ScrollContainer from "@/components/common/ScrollContainer/index.vue";
import { useAuthentication, useConfirmationModal } from "@/composables";
import ConfirmationModal from "@/components/common/ConfirmationModal/index.vue";
import { LeagueContext } from "@/types";

const EditLeagueMembers = defineComponent({
  name: "EditLeagueMembers",

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
    const router = useRouter();
    const store = useStore();
    const {
      isModalVisible,
      showConfirmationModal: showConfirmationModal_,
      hideConfirmationModal: hideConfirmationModal_,
    } = useConfirmationModal();
    const selectedLeagueMember = ref<any | null>(null);

    function showConfirmationModal(leagueMember: any) {
      selectedLeagueMember.value = leagueMember;
      showConfirmationModal_();
    }

    function hideConfirmationModal() {
      selectedLeagueMember.value = null;
      hideConfirmationModal_();
    }
    const { leagueContext } = toRefs(props);
    const { leagueId } = leagueContext.value;

    const { result, refetch } = useQuery(
      gql`
        query LeagueDetails($id: ID!) {
          league(id: $id) {
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
            myLeagueMember {
              id
              isActive
              isCommissioner
            }
          }
        }
      `,
      { id: leagueId },
      { fetchPolicy: "cache-first" }
    );
    const leagueMembers = computed(
      () =>
        league.value?.leagueMembers
          .filter((x) => x.isActive)
          .sort((x, y) => x.user.displayName.localeCompare(y.user.displayName)) ?? []
    );

    const league = useResult(result, null, (data) => data.league);

    const { mutate: removeLeagueMember } = useMutation(
      gql`
        mutation RemoveLeagueMember($input: RemoveLeagueMemberInput!) {
          removeLeagueMember(input: $input) {
            id
          }
        }
      `
    );

    const handleRemoveClick = async (leagueMemberId: string) => {
      const { data, errors } = await removeLeagueMember({ input: { leagueMemberId } });
      hideConfirmationModal_();
      if (data) {
        store.dispatch("pushNotification", {
          type: "success",
          message: "League member removed successfully!",
        });
        refetch();
      } else {
        store.dispatch("pushNotification", {
          type: "error",
          message: "Failed to remove league member.",
        });
      }
    };
    return {
      league,
      leagueId,
      leagueMembers,
      handleRemoveClick,
      isModalVisible,
      showConfirmationModal,
      hideConfirmationModal,
      selectedLeagueMember,
    };
  },
});
export default EditLeagueMembers;
</script>
