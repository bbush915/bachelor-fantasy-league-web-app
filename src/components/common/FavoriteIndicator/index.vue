<template>
  <div>
    <FavoriteIconFilled v-if="checked" />
    <FavoriteIcon v-else />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  import FavoriteIconFilled from "@/assets/favorite-filled.svg?component";
  import FavoriteIcon from "@/assets/favorite.svg?component";

  const FavoriteIndicator = defineComponent({
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
