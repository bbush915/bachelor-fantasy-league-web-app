<template>
  <div class="flex flex-wrap justify-center py-9">
    <div
      v-for="contestant in contestants"
      :key="contestant.id"
      class="px-6 py-3 m-4 rounded-xl bg-gray"
    >
      <span class="text-lg leading-8">{{ contestant.name }}</span>

      <div class="w-64 h-64 overflow-hidden rounded-full">
        <img :src="contestant.imageUrl" />
      </div>

      <div class="flex flex-col mb-6 text-xs leading-5">
        <span>{{ contestant.age }}</span>
        <span>{{ contestant.occupation }}</span>
        <span>{{ contestant.hometown }}</span>
      </div>

      <div class="flex justify-center">
        <button
          class="w-48 h-10 text-sm border rounded-full border-pink text-pink"
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
            imageUrl
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