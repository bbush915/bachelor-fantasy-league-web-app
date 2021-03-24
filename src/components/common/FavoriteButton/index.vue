<template>
  <button v-if="isFavorite" @click="handleRemoveFavorite(contestantId)">
    <FavoriteIconFilled />
  </button>
  <button v-else><FavoriteIcon @click="handleAddFavorite(contestantId)" /></button>
</template>

<script lang="ts">
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { defineComponent } from "vue";
import { useStore } from "vuex";

import FavoriteIcon from "@/assets/favorite.svg";
import FavoriteIconFilled from "@/assets/favorite-filled.svg";

const FavoriteButton = defineComponent({
  name: "FavoriteButton",

  components: {
    FavoriteIcon,
    FavoriteIconFilled,
  },

  props: {
    contestantId: {
      type: String,
      required: true,
    },

    isFavorite: {
      type: Boolean,
      required: true,
    },
  },

  setup() {
    const store = useStore();

    const { mutate: addFavorite } = useMutation(
      gql`
        mutation AddFavorite($input: UserFavoriteInput!) {
          addFavorite(input: $input) {
            id
            isFavorite
          }
        }
      `
    );

    const { mutate: removeFavorite } = useMutation(
      gql`
        mutation RemoveFavorite($input: UserFavoriteInput!) {
          removeFavorite(input: $input) {
            id
            isFavorite
          }
        }
      `
    );

    async function handleAddFavorite(contestantId: string) {
      try {
        await addFavorite({ input: { contestantId } });
      } catch (e) {
        store.dispatch("pushNotification", {
          type: "error",
          message: "Failed to save favorite. Try again later",
        });
      }
    }

    async function handleRemoveFavorite(contestantId: string) {
      try {
        await removeFavorite({ input: { contestantId } });
      } catch (e) {
        store.dispatch("pushNotification", {
          type: "error",
          message: "Failed to remove favorite. Try again later",
        });
      }
    }
    return {
      handleAddFavorite,
      handleRemoveFavorite,
    };
  },
});
export default FavoriteButton;
</script>
