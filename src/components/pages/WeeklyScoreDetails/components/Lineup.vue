<template>
  <div class="px-8">
    <div
      v-for="{ id, headshotUrl, name, score } in lineupContestants"
      :key="id"
      class="flex items-center justify-between py-1"
    >
      <div class="flex items-center">
        <div class="w-16 h-16 mr-6 overflow-hidden rounded-full">
          <img :src="headshotUrl" />
        </div>

        <span class="txt-body">
          {{ name }}
        </span>
      </div>

      <span class="txt-body">
        {{ score }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRef, toRefs } from "vue";

import { useLineupContestants } from "@/composables";

const Lineup = defineComponent({
  name: "Lineup",

  props: {
    selectedLeagueMemberId: {
      type: String,
      required: true,
    },

    selectedSeasonWeekId: {
      type: String,
      required: false,
    },
  },

  setup(props) {
    const { selectedLeagueMemberId } = toRefs(props);
    const selectedSeasonWeekId = toRef(props, "selectedSeasonWeekId");

    const { lineupContestants } = useLineupContestants(
      selectedLeagueMemberId,
      selectedSeasonWeekId
    );

    return {
      lineupContestants,
    };
  },
});

export default Lineup;
</script>
