<template>
  <div class="relative p-8 bg-gray rounded-xl">
    <h1 class="text-lg">My Week {{ week }} Lineup</h1>

    <div v-if="!isLineupSet" class="flex flex-col items-center mt-8">
      <div class="flex items-center mb-6">
        <AlertIcon />
        <span class="ml-2 font-thin"
          >You have not set your lineup for this week!</span
        >
      </div>

      <router-link
        class="flex items-center justify-center w-48 h-10 rounded-full bg-pink text-gray-darkest"
        :to="{ name: 'set-lineup' }"
      >
        Set Lineup
      </router-link>
    </div>

    <router-link
      v-if="isLineupSet"
      class="absolute flex items-center top-8 right-8"
      :to="{ name: 'set-lineup' }"
    >
      <span class="mr-4 text-xs">Edit Lineup</span>
      <EditIcon />
    </router-link>

    <div v-if="isLineupSet" class="flex flex-wrap justify-center mt-8">
      <div
        v-for="contestant in contestants"
        :key="contestant.id"
        class="flex flex-col items-center m-2"
      >
        <div class="w-24 h-24 mb-2 overflow-hidden rounded-full">
          <img :src="contestant.imageUrl" />
        </div>

        <span>{{ contestant.name }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { useRoute, useRouter } from "vue-router";

import AlertIcon from "@/assets/alert.svg";
import EditIcon from "@/assets/edit.svg";

interface ILineup {
  id: string;
  lineupContestants: {
    id: string;
    contestant: {
      id: string;
      name: string;
      imageUrl: string;
    };
  }[];
}

const Lineup = defineComponent({
  name: "Lineup",

  components: {
    AlertIcon,
    EditIcon,
  },

  props: {
    lineup: {
      type: Object as PropType<ILineup>,
    },
  },

  setup(props) {
    const router = useRouter();
    const route = useRoute();

    const contestants = props.lineup?.lineupContestants.map(
      (x) => x.contestant
    );

    let isLineupSet = computed(() => (contestants?.length ?? 0) > 0);

    return {
      week: 7,
      isLineupSet,
      contestants,
    };
  },
});

export default Lineup;
</script>