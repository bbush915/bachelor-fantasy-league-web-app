<template>
  <div class="relative p-8 bg-gray rounded-xl">
    <h1 class="text-lg">My Week {{ week }} Lineup</h1>

    <div v-if="!hasSetLineup" class="flex flex-col items-center mt-8">
      <div class="flex items-center mb-6">
        <AlertIcon />
        <span class="ml-2 font-thin"
          >You have not set your lineup for this week!</span
        >
      </div>

      <button class="w-48 h-10 rounded-full bg-pink text-gray-darkest">
        Set Lineup
      </button>
    </div>

    <button
      v-if="hasSetLineup"
      class="absolute flex items-center top-8 right-8"
    >
      <span class="mr-4 text-xs">Edit Lineup</span>
      <EditIcon />
    </button>

    <div v-if="hasSetLineup" class="flex flex-wrap justify-center mt-8">
      <div
        v-for="(contestant, index) in lineup"
        :key="index"
        class="flex flex-col items-center m-2"
      >
        <div class="w-24 h-24 mb-2 overflow-hidden rounded-full">
          <img :src="contestant.image_sm_url" />
        </div>

        <span>{{ contestant.name }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

import AlertIcon from "@/assets/alert.svg";
import EditIcon from "@/assets/edit.svg";

const MyLineup = defineComponent({
  name: "MyLineup",

  components: {
    AlertIcon,
    EditIcon,
  },

  setup() {
    const lineup = [
      {
        name: "Abigail",
        image_sm_url:
          "https://cdn1.edgedatg.com/aws/v2/abc/TheBachelor/person/3604012/229c71e1f6eff0cad1cde61c2fb9fc0c/330x330-Q90_229c71e1f6eff0cad1cde61c2fb9fc0c.jpg",
      },
      {
        name: "Alana",
        image_sm_url:
          "https://cdn1.edgedatg.com/aws/v2/abc/TheBachelor/person/3604024/2fea3f5c32175c1a508bb76d3365261f/330x330-Q90_2fea3f5c32175c1a508bb76d3365261f.jpg",
      },
      {
        name: "Alicia",
        image_sm_url:
          "https://cdn1.edgedatg.com/aws/v2/abc/TheBachelor/person/3604960/5e91b008b46219f9ef7d89baff264511/330x330-Q90_5e91b008b46219f9ef7d89baff264511.jpg",
      },
      {
        name: "Amber",
        image_sm_url:
          "https://cdn1.edgedatg.com/aws/v2/abc/TheBachelor/person/3604969/b9c2b495822d3fcca136f61892b13e8e/330x330-Q90_b9c2b495822d3fcca136f61892b13e8e.jpg",
      },
      {
        name: "Anna",
        image_sm_url:
          "https://cdn1.edgedatg.com/aws/v2/abc/TheBachelor/person/3604981/59161557992449173390b567a3fdf24b/330x330-Q90_59161557992449173390b567a3fdf24b.jpg",
      },
      {
        name: "Bri",
        image_sm_url:
          "https://cdn1.edgedatg.com/aws/v2/abc/TheBachelor/person/3604994/0162fa3620e62be540779416de9d8ec2/330x330-Q90_0162fa3620e62be540779416de9d8ec2.jpg",
      },
    ];

    // const lineup: any[] = [];

    let hasSetLineup = computed(() => lineup.length > 0);

    return {
      week: 7,
      lineup,
      hasSetLineup,
    };
  },
});

export default MyLineup;
</script>