<template>
  <div class="relative p-8 bg-gray rounded-xl">
    <h1 class="text-lg">Top Week {{ week }} Contestants</h1>

    <router-link class="absolute top-8 right-8" :to="{ name: 'contestant-score-details' }">
      <MoreIcon />
    </router-link>

    <div class="mt-8 font-thin">
      <div v-for="(contestant, index) in contestants" :key="index" class="flex items-center py-2">
        <span class="w-7">{{ getOrdinal(index + 1) }}</span>
        <div class="w-16 h-16 ml-5 overflow-hidden rounded-full">
          <img :src="contestant.image_sm_url" />
        </div>
        <span class="ml-5">{{ contestant.name }}</span>
        <div class="flex-grow" />
        <span>{{ contestant.score }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import MoreIcon from "@/assets/more.svg";
import { getOrdinal } from "@/utils";

const ContestantScores = defineComponent({
  name: "ContestantScores",

  components: {
    MoreIcon,
  },

  setup() {
    const contestants = [
      {
        name: "Abigail",
        image_sm_url:
          "https://cdn1.edgedatg.com/aws/v2/abc/TheBachelor/person/3604012/229c71e1f6eff0cad1cde61c2fb9fc0c/330x330-Q90_229c71e1f6eff0cad1cde61c2fb9fc0c.jpg",
        score: 22,
      },
      {
        name: "Alana",
        image_sm_url:
          "https://cdn1.edgedatg.com/aws/v2/abc/TheBachelor/person/3604024/2fea3f5c32175c1a508bb76d3365261f/330x330-Q90_2fea3f5c32175c1a508bb76d3365261f.jpg",
        score: 22,
      },
      {
        name: "Alicia",
        image_sm_url:
          "https://cdn1.edgedatg.com/aws/v2/abc/TheBachelor/person/3604960/5e91b008b46219f9ef7d89baff264511/330x330-Q90_5e91b008b46219f9ef7d89baff264511.jpg",
        score: 17,
      },
    ];
    return {
      week: 6,
      contestants,
      getOrdinal,
    };
  },
});

export default ContestantScores;
</script>
