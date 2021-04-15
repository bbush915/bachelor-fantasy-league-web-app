<template>
  <div>
    <FavoriteIconFilled v-if="checked" />
    <FavoriteIcon v-else />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  import FavoriteIconFilled from "@/assets/favorite-filled.svg";
  import FavoriteIcon from "@/assets/favorite.svg";

  const FavoriteIndicator = defineComponent({
    name: "FavoriteIndicator",

    components: {
      FavoriteIcon,
      FavoriteIconFilled,
    },

    props: {
      checked: {
        type: Boolean,
        required: true,
      },
    },
  });

  export default FavoriteIndicator;
</script>
