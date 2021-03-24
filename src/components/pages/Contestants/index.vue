<template>
  <div class="flex flex-wrap justify-center py-3">
    <div
      v-for="contestant in contestants"
      :key="contestant.id"
      class="px-6 py-3 m-4 rounded-xl bg-gray"
    >
      <div class="flex flex-row justify-between">
        <span class="text-lg leading-8">{{ contestant.name }}</span>
        <FavoriteButton :contestantId="contestant.id" :isFavorite="contestant.isFavorite" />
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
import FavoriteButton from "@/components/common/FavoriteButton/index.vue";

import { useContestantModal, useContestants } from "@/composables";

const Contestants = defineComponent({
  name: "Contestants",

  components: {
    Avatar,
    ContestantModal,
    FavoriteButton,
  },

  setup() {
    const { contestants } = useContestants();

    const {
      selectedContestant,
      isContestantModalVisible,
      showContestantModal,
      hideContestantModal,
    } = useContestantModal();

    return {
      contestants,
      selectedContestant,
      isContestantModalVisible,
      showContestantModal,
      hideContestantModal,
    };
  },
});

export default Contestants;
</script>
