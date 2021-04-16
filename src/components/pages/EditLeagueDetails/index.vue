<template>
  <div class="flex flex-col">
    <h1 class="mb-8">Edit League Details</h1>

    <section class="flex flex-col w-1/2 px-8 pt-6 pb-8 mx-auto bg-gray-dark rounded-xl">
      <div class="flex justify-between mb-4">
        <h2>League Details</h2>

        <button class="flex items-center" @click="showDeleteLeagueConfirmationModal">
          <span class="mr-2 txt-label text-pink-dark">Delete League</span>

          <div class="w-5 h-5 mb-2">
            <DeleteIcon />
          </div>
        </button>
      </div>

      <EditLeagueDetailsForm v-if="league" :league="league" />
    </section>

    <ConfirmationModal
      v-if="isDeleteLeagueConfirmationModalVisible"
      :onClose="hideDeleteLeagueConfirmationModal"
      :onConfirm="handleDeleteLeague"
      :message="'Are you sure you want to delete this league? This action cannot be undone.'"
    />
  </div>
</template>

<script lang="ts">
  import { useMutation, useQuery, useResult } from "@vue/apollo-composable";
  import gql from "graphql-tag";
  import { defineComponent, PropType, toRefs } from "vue";
  import { useRouter } from "vue-router";
  import { useStore } from "vuex";

  import DeleteIcon from "@/assets/delete.svg";
  import ConfirmationModal from "@/components/common/ConfirmationModal/index.vue";
  import { useConfirmationModal } from "@/composables";
  import { LeagueContext } from "@/types";
  import EditLeagueDetailsForm from "./components/EditLeagueDetailsForm/index.vue";

  type TLeagueInformationResult = {
    league: {
      id: string;
      name: string;
      description: string;
      logoUrl: string;
      isPublic: boolean;
      isShareable: boolean;
    };
  };

  type TLeagueInformationVariables = { leagueId: string };

  type TDeleteLeagueResult = { deleteLeague: { success: boolean } };
  type TDeleteLeagueVariables = { input: { id: string } };

  const EditLeagueDetails = defineComponent({
    components: {
      ConfirmationModal,
      DeleteIcon,
      EditLeagueDetailsForm,
    },

    props: {
      leagueContext: {
        type: Object as PropType<LeagueContext>,
        required: true,
      },
    },

    setup(props) {
      const { leagueContext } = toRefs(props);

      const store = useStore();
      const router = useRouter();

      const { result } = useQuery<TLeagueInformationResult, TLeagueInformationVariables>(
        gql`
          query LeagueDetails($leagueId: ID!) {
            league(id: $leagueId) {
              id
              name
              description
              logoUrl
              isPublic
              isShareable
            }
          }
        `,
        { leagueId: leagueContext.value.leagueId }
      );

      const league = useResult(result, null, (data) => data.league);

      const {
        isConfirmationModalVisible,
        showConfirmationModal,
        hideConfirmationModal,
      } = useConfirmationModal();

      const { mutate: deleteLeague } = useMutation<TDeleteLeagueResult, TDeleteLeagueVariables>(
        gql`
          mutation DeleteLeague($input: DeleteLeagueInput!) {
            deleteLeague(input: $input) {
              success
            }
          }
        `
      );

      async function handleDeleteLeague() {
        const { data } = await deleteLeague({
          input: { id: leagueContext.value.leagueId },
        });

        if (data) {
          router.push({ name: "my-leagues" });

          store.dispatch("pushNotification", {
            type: "success",
            message: "League deleted successfully!",
          });
        } else {
          store.dispatch("pushNotification", {
            type: "error",
            message: "Failed to delete league.",
          });
        }
      }

      return {
        league,
        isDeleteLeagueConfirmationModalVisible: isConfirmationModalVisible,
        showDeleteLeagueConfirmationModal: showConfirmationModal,
        hideDeleteLeagueConfirmationModal: hideConfirmationModal,
        handleDeleteLeague,
      };
    },
  });

  export default EditLeagueDetails;
</script>
