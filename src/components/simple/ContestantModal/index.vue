<template>
  <div class="overlay w-screen h-screen fixed top-0 z-50" @click="onClose">
    <div
      class="modal px-16 pb-12 bg-gray-darkest rounded-xl flex flex-col"
      @click.stop
    >
      <button class="absolute right-4 top-4" @click="onClose">
        <CloseIcon />
      </button>

      <h1 class="absolute top-8 left-8 text-2xl">Contestant Details</h1>

      <div class="mt-20 mb-4 flex items-center">
        <div class="w-64 h-64 mr-8 overflow-hidden rounded-full">
          <img :src="contestant.image_sm_url" />
        </div>

        <div class="flex flex-col">
          <span class="mb-4 text-lg">{{ contestant.name }}</span>

          <div class="text-sm font-thin flex flex-col space-y-1">
            <span>{{ contestant.age }}</span>
            <span>{{ contestant.occupation }}</span>
            <span>{{ contestant.hometown }}</span>
          </div>
        </div>
      </div>

      <div class="text-sm font-thin max-w-2xl">
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