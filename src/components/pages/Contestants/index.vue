<template>
  <div class="py-9 flex flex-wrap justify-center">
    <div
      v-for="contestant in contestants"
      :key="contestant.id"
      class="m-4 px-6 py-3 rounded-xl bg-gray"
    >
      <span class="text-lg leading-8">{{ contestant.name }}</span>

      <div class="w-64 h-64 rounded-full overflow-hidden">
        <img :src="contestant.image_sm_url" />
      </div>

      <div class="flex flex-col text-xs leading-5 mb-6">
        <span>{{ contestant.age }}</span>
        <span>{{ contestant.occupation }}</span>
        <span>{{ contestant.hometown }}</span>
      </div>

      <div class="flex justify-center">
        <button
          class="w-48 h-10 rounded-full border border-pink text-pink text-sm"
          @click="showContestantModal(contestant)"
        >
          About
        </button>
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
import { useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { defineComponent, ref } from "vue";

import ContestantModal from "@/components/simple/ContestantModal/index.vue";

const Contestants = defineComponent({
  name: "Contestants",

  components: {
    ContestantModal,
  },

  setup() {
    let selectedContestant = ref<any>(null);
    let isContestantModalVisible = ref(false);

    function showContestantModal(contestant: any) {
      selectedContestant.value = contestant;
      isContestantModalVisible.value = true;
    }

    function hideContestantModal() {
      isContestantModalVisible.value = false;
      selectedContestant.value = null;
    }

    const { result } = useQuery(
      gql`
        query GetContestants {
          contestants {
            id
            name
            image_sm_url
            age
            occupation
            hometown
            bio
            trivia
          }
        }
      `
    );

    const contestants = useResult(result, null, (data) => data.contestants);

    return {
      contestants,
      selectedContestant,
      showContestantModal,
      hideContestantModal,
      isContestantModalVisible,
    };
  },
});

export default Contestants;
</script>