<template>
  <div class="fixed top-0 left-0 z-50 w-screen h-screen overlay" @click="onClose">
    <div class="flex flex-col px-16 pb-12 modal bg-gray-darkest rounded-xl" @click.stop>
      <button class="absolute right-4 top-4" @click="onClose">
        <CloseIcon />
      </button>

      <h1 class="absolute top-8 left-8">Contestant Details</h1>

      <div class="flex items-center mt-20 mb-4">
        <Avatar class="w-64 h-64 mr-8" :src="contestant.headshotUrl" />

        <div class="flex flex-col">
          <div class="flex flex-row justify-between">
            <h2 class="mb-4">{{ contestant.name }}</h2>
            <FavoriteButton :contestantId="contestant.id" :isFavorite="isFavorite" />
          </div>
          <div class="flex flex-col space-y-1">
            <span class="tx-body">{{ contestant.age }}</span>
            <span class="tx-body">{{ contestant.occupation }}</span>
            <span class="tx-body">{{ contestant.hometown }}</span>
          </div>
        </div>
      </div>

      <div class="max-w-2xl">
        <p class="mb-4">
          {{ contestant.bio }}
        </p>

        <ul class="space-y-2">
          <li v-for="(fact, index) in contestant.trivia" :key="index" class="txt-body">
            - {{ fact }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, toRef, toRefs } from "vue";

import CloseIcon from "@/assets/close.svg";
import Avatar from "@/components/common/Avatar/index.vue";
import FavoriteButton from "@/components/common/FavoriteButton/index.vue";

import { IContestant } from "@/composables";

const ContestantModal = defineComponent({
  name: "ContestantModal",

  components: {
    Avatar,
    CloseIcon,
    FavoriteButton,
  },

  props: {
    contestant: {
      type: Object as PropType<IContestant>,
      required: true,
    },

    onClose: {
      type: Function,
      required: true,
    },
  },

  setup(props) {
    const { contestant } = toRefs(props);
    const isFavorite = toRef(contestant.value, "isFavorite");

    return {
      isFavorite,
    };
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
