<template>
  <div class="flex flex-wrap justify-center py-3">
    <div
      v-for="contestant in contestants"
      :key="contestant.id"
      class="relative px-6 py-3 m-4 rounded-xl bg-gray"
    >
      <span class="text-lg leading-8">{{ contestant.name }}</span>

      <FavoriteIndicator
        v-if="isAuthenticated"
        tabindex="0"
        class="absolute cursor-pointer top-3 right-3 w-9 h-9"
        :checked="contestant.isFavorite"
        @click="toggleUserFavorite(contestant.id)"
      />

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
import { computed, defineComponent } from "vue";

import Avatar from "@/components/common/Avatar/index.vue";
import ContestantModal from "@/components/common/ContestantModal/index.vue";
import FavoriteIndicator from "@/components/common/FavoriteIndicator/index.vue";
import {
  useAuthentication,
  useContestantModal,
  useContestants,
  useUserFavorites,
} from "@/composables";

const Contestants = defineComponent({
  name: "Contestants",

  components: {
    Avatar,
    ContestantModal,
    FavoriteIndicator,
  },

  setup() {
    const { isAuthenticated } = useAuthentication();

    const { contestants: contestants_ } = useContestants();
    const { userFavorites, toggleUserFavorite } = useUserFavorites();

    const contestants = computed(() =>
      contestants_.value.map((contestant) => ({
        ...contestant,
        isFavorite: userFavorites.value.some((x) => x.contestantId === contestant.id),
      }))
    );

    const {
      selectedContestant,
      isContestantModalVisible,
      showContestantModal,
      hideContestantModal,
    } = useContestantModal();

    return {
      contestants,
      isAuthenticated,
      toggleUserFavorite,
      selectedContestant,
      isContestantModalVisible,
      showContestantModal,
      hideContestantModal,
    };
  },
});

export default Contestants;
</script>
