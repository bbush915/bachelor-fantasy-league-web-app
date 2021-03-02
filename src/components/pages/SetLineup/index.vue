<template>
  <div class="flex flex-col items-center">
    <div class="self-start ml-40">
      <h1 class="mb-6 text-3xl">Set Lineup</h1>
    </div>

    <div class="relative flex flex-col w-3/4 p-8 mb-8 bg-gray-dark rounded-xl">
      <h2 class="mb-4 text-lg">Select who you think deserves a rose.</h2>

      <div class="flex flex-col items-start">
        <span class="my-2 text-sm font-thin"
          >{{ rosesRemaining }} roses left</span
        >

        <div class="flex flex-wrap mb-8">
          <div v-for="i in rosesRemaining" :key="i" class="w-12 h-12">
            <RoseIcon />
          </div>
        </div>
      </div>

      <div class="flex flex-wrap justify-center mb-8">
        <div
          v-for="(contestant, index) in contestants"
          :key="index"
          class="relative flex flex-col items-center my-3"
        >
          <button
            class="absolute top-0 right-0"
            @click="showContestantModal(contestant)"
          >
            <InfoIcon />
          </button>

          <button
            class="relative w-24 h-24 mx-3 mb-3 overflow-hidden rounded-full contestant"
            @click="handleClick(contestant.id)"
            :class="{
              selected: selectedContestants.some((x) => x === contestant.id),
            }"
          >
            <img :src="contestant.imageUrl" />

            <div
              v-if="selectedContestants.some((x) => x === contestant.id)"
              class="absolute bottom-0 w-14"
            >
              <RoseIcon />
            </div>
          </button>

          <span class="text-sm font-thin">{{ contestant.name }}</span>
        </div>
      </div>

      <button
        class="self-center w-48 h-10 rounded-full bg-pink text-gray-darkest"
      >
        Save
      </button>
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

import InfoIcon from "@/assets/info.svg";
import RoseIcon from "@/assets/rose.svg";
import ContestantModal from "@/components/simple/ContestantModal/index.vue";

const SetLineup = defineComponent({
  name: "SetLineup",

  components: {
    ContestantModal,
    InfoIcon,
    RoseIcon,
  },

  setup() {
    let rosesRemaining = ref(10);
    let selectedContestants = ref<string[]>([]);
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

    function handleClick(id: string) {
      const index = selectedContestants.value.indexOf(id);

      if (index > -1) {
        selectedContestants.value.splice(index, 1);
        rosesRemaining.value++;
      } else if (rosesRemaining.value > 0) {
        selectedContestants.value.push(id);
        rosesRemaining.value--;
      }
    }

    const contestants = useResult(result, null, (data) => data.contestants);

    return {
      contestants,
      selectedContestants,
      rosesRemaining,
      handleClick,
      selectedContestant,
      showContestantModal,
      hideContestantModal,
      isContestantModalVisible,
    };
  },
});

export default SetLineup;
</script>

<style lang="postcss" scoped>
.contestant {
  &.selected {
    box-shadow: 0px 0px 8px 8px #e21c34;
  }
}
</style>