<template>
  <Teleport to="body">
    <div class="fixed top-0 left-0 z-50 w-screen h-screen overlay" @click="onClose">
      <div class="relative flex flex-col px-16 pb-12 modal bg-gray-darkest rounded-xl" @click.stop>
        <button class="absolute right-4 top-4" @click="onClose">
          <div class="w-8 h-8">
            <CloseIcon />
          </div>
        </button>

        <h2 class="absolute top-8 left-8">Contestant Details</h2>

        <div class="relative flex items-center mt-20 mb-4">
          <FavoriteIndicator
            v-if="isAuthenticated"
            tabindex="0"
            class="absolute cursor-pointer top-3 right-3 w-9 h-9"
            :checked="isFavorite"
            @click="toggleUserFavorite(contestant.id)"
          />

          <Avatar class="w-64 h-64 mr-8" :src="contestant.headshotUrl" />

          <div class="flex flex-col">
            <h2 class="mb-4">{{ contestant.name }}</h2>

            <div class="flex flex-col space-y-1">
              <span class="txt-body">{{ contestant.age }}</span>
              <span class="txt-body">{{ contestant.occupation }}</span>
              <span class="txt-body">{{ contestant.hometown }}</span>
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
  </Teleport>
</template>

<script lang="ts">
  import { computed, defineComponent, PropType, toRefs } from "vue";

  import CloseIcon from "@/assets/close.svg";
  import Avatar from "@/components/common/Avatar/index.vue";
  import FavoriteIndicator from "@/components/common/FavoriteIndicator/index.vue";
  import { IContestant, useAuthentication, useUserFavorites } from "@/composables";

  const ContestantModal = defineComponent({
    name: "ContestantModal",

    components: {
      Avatar,
      CloseIcon,
      FavoriteIndicator,
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

      const { isAuthenticated } = useAuthentication();

      const { userFavorites, toggleUserFavorite } = useUserFavorites();

      const isFavorite = computed(() =>
        userFavorites.value.some((x) => x.contestantId === contestant.value.id)
      );

      return {
        isAuthenticated,
        isFavorite,
        toggleUserFavorite,
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
