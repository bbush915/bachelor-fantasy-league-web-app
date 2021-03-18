<template>
  <div v-if="lineupContestants.length > 0" class="px-8">
    <div
      v-for="{ id, headshotUrl, name, score } in lineupContestants"
      :key="id"
      class="flex items-center justify-between py-1"
    >
      <div class="flex items-center">
        <Avatar class="w-16 h-16 mr-6" :src="headshotUrl" />

        <span class="txt-body">
          {{ name }}
        </span>
      </div>

      <span class="txt-body">
        {{ score }}
      </span>
    </div>
  </div>

  <div v-else class="px-8">
    <p>No lineup for this week!</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRef, toRefs } from "vue";

import Avatar from "@/components/common/Avatar/index.vue";
import { useLineupContestants } from "@/composables";

const Lineup = defineComponent({
  name: "Lineup",

  components: {
    Avatar,
  },

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
