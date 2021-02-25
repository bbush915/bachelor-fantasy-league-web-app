<template>
  <div class="h-full px-20 py-9 bg-gray-darkest grid grid-cols-4 gap-8">
    <div
      v-for="contestant in contestants"
      :key="contestant.id"
      class="bg-gray rounded-xl max-w-xs px-6 py-3"
    >
      <span class="text-white text-lg leading-8">{{ contestant.name }}</span>

      <div class="w-64 h-64 rounded-full overflow-hidden">
        <img :src="contestant.image_sm_url" />
      </div>

      <div class="flex flex-col text-white text-xs leading-5 mb-6">
        <span>{{ contestant.age }}</span>
        <span>{{ contestant.occupation }}</span>
        <span>{{ contestant.hometown }}</span>
      </div>

      <div class="flex justify-center">
        <button
          class="w-48 h-10 rounded-full border border-pink text-pink text-sm"
        >
          About
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { defineComponent } from "vue";

const Contestants = defineComponent({
  name: "Contestants",

  setup() {
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
          }
        }
      `
    );

    const contestants = useResult(result, null, (data) => data.contestants);

    return {
      contestants,
    };
  },
});

export default Contestants;
</script>