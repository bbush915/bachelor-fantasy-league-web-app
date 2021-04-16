<template>
  <div class="flex flex-col items-center justify-end">
    <Avatar class="w-24 h-24 mb-2" :src="leaderboardEntry.avatarUrl" />

    <div
      class="flex flex-col items-center w-40 space-y-2 bg-gray"
      :class="`pb-${place === 1 ? 8 : 2}`"
    >
      <GoldMedal v-if="place === 1" />
      <SilverMedal v-if="place === 2" />
      <BronzeMedal v-if="place === 3" />

      <span class="txt-body">{{ leaderboardEntry.displayName }}</span>

      <h2 class="text-pink">{{ leaderboardEntry.score }}</h2>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  import Avatar from "@/components/common/Avatar/index.vue";
  import BronzeMedal from "@/assets/bronze-medal.svg";
  import GoldMedal from "@/assets/gold-medal.svg";
  import SilverMedal from "@/assets/silver-medal.svg";

  const Podium = defineComponent({
    components: {
      Avatar,
      BronzeMedal,
      GoldMedal,
      SilverMedal,
    },

    props: {
      place: {
        type: Number,
        required: true,
      },

      leaderboardEntry: {
        type: Object,
        required: true,
      },
    },
  });

  export default Podium;
</script>
