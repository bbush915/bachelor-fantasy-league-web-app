<template>
  <div class="flex flex-wrap justify-center py-3">
    <div
      v-for="contestant in contestants"
      :key="contestant.id"
      class="px-6 py-3 m-4 rounded-xl bg-gray"
    >
      <div class="flex flex-row justify-between">
        <span class="text-lg leading-8">{{ contestant.name }}</span>
        <button v-if="contestant.isFavorite" @click="handleRemoveFavorite(contestant.id)">
          <FavoriteIconFilled />
        </button>
        <button v-else><FavoriteIcon @click="handleAddFavorite(contestant.id)" /></button>
      </div>
      <Avatar class="w-64 h-64" :src="contestant.headshotUrl" />

      <div class="flex flex-col mb-6 text-xs leading-5">
        <span>{{ contestant.age }}</span>
        <span>{{ contestant.occupation }}</span>
        <span>{{ contestant.hometown }}</span>
      </div>

      <div class="flex justify-center">
        <button class="btn-secondary" @click="showContestantModal(contestant)">About</button>
      </div>
    </div>

    <ContestantModal
      v-if="isContestantModalVisible"
      :contestant="selectedContestant"
      :onClose="hideContestantModal"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Avatar from "@/components/common/Avatar/index.vue";
import ContestantModal from "@/components/common/ContestantModal/index.vue";
import FavoriteIcon from "@/assets/favorite.svg";
import FavoriteIconFilled from "@/assets/favorite-filled.svg";

import { useContestantModal, useContestants } from "@/composables";
import { useStore } from "vuex";
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";

const Contestants = defineComponent({
  name: "Contestants",

  components: {
    Avatar,
    ContestantModal,
    FavoriteIcon,
    FavoriteIconFilled,
  },

  setup() {
    const { contestants } = useContestants();
    const store = useStore();

    const {
      selectedContestant,
      isContestantModalVisible,
      showContestantModal,
      hideContestantModal,
    } = useContestantModal();

    const { mutate: addFavorite } = useMutation(
      gql`
        mutation AddFavorite($input: UserFavoriteInput!) {
          addFavorite(input: $input) {
            id
            isFavorite
          }
        }
      `
    );

    const { mutate: removeFavorite } = useMutation(
      gql`
        mutation RemoveFavorite($input: UserFavoriteInput!) {
          removeFavorite(input: $input) {
            id
            isFavorite
          }
        }
      `
    );

    async function handleAddFavorite(contestantId: string) {
      try {
        await addFavorite({ input: { contestantId } });
      } catch (e) {
        store.dispatch("pushNotification", {
          type: "error",
          message: "Failed to save favorite. Try again later",
        });
      }
    }

    async function handleRemoveFavorite(contestantId: string) {
      try {
        await removeFavorite({ input: { contestantId } });
      } catch (e) {
        store.dispatch("pushNotification", {
          type: "error",
          message: "Failed to remove favorite. Try again later",
        });
      }
    }

    return {
      contestants,
      selectedContestant,
      isContestantModalVisible,
      showContestantModal,
      hideContestantModal,
      handleAddFavorite,
      handleRemoveFavorite,
    };
  },
});

export default Contestants;
</script>
