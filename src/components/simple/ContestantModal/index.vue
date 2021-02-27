<template>
  <div class="fixed top-0 z-50 w-screen h-screen overlay" @click="onClose">
    <div
      class="flex flex-col px-16 pb-12 modal bg-gray-darkest rounded-xl"
      @click.stop
    >
      <button class="absolute right-4 top-4" @click="onClose">
        <CloseIcon />
      </button>

      <h1 class="absolute text-2xl top-8 left-8">Contestant Details</h1>

      <div class="flex items-center mt-20 mb-4">
        <div class="w-64 h-64 mr-8 overflow-hidden rounded-full">
          <img :src="contestant.image_sm_url" />
        </div>

        <div class="flex flex-col">
          <span class="mb-4 text-lg">{{ contestant.name }}</span>

          <div class="flex flex-col text-sm font-thin space-y-1">
            <span>{{ contestant.age }}</span>
            <span>{{ contestant.occupation }}</span>
            <span>{{ contestant.hometown }}</span>
          </div>
        </div>
      </div>

      <div class="max-w-2xl text-sm font-thin">
        <p class="mb-4 leading-6">
          {{ contestant.bio }}
        </p>

        <ul class="font-thin space-y-2">
          <li v-for="(fact, index) in contestant.trivia" :key="index">
            - {{ fact }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import CloseIcon from "@/assets/close.svg";

type Contestant = {
  name: string;
};

const ContestantModal = defineComponent({
  name: "ContestantModal",

  props: {
    contestant: {
      type: Object as PropType<Contestant>,
      required: true,
    },

    onClose: {
      type: Function,
      required: true,
    },
  },

  components: {
    CloseIcon,
  },
});

export default ContestantModal;
</script>

<style scoped>
.overlay {
  background-color: rgba(0, 0, 0, 0.5);
}

.modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>