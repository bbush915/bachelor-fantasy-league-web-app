<template>
  <div class="relative p-8 bg-gray-dark rounded-xl">
    <h1 class="text-lg">My Week {{ leagueContext.weekNumber }} Lineup</h1>

    <div v-if="!isLineupSet" class="flex flex-col items-center mt-8">
      <div class="flex items-center mb-6">
        <div class="mr-2 w-9 h-9">
          <AlertIcon />
        </div>

        <span class="txt-body">You have not set your lineup for this week!</span>
      </div>

      <router-link
        class="btn-primary"
        :to="{
          name: 'set-lineup',
        }"
      >
        Set Lineup
      </router-link>
    </div>

    <router-link
      v-if="isLineupSet"
      class="absolute flex items-center top-8 right-8"
      :to="{
        name: 'set-lineup',
      }"
    >
      <span class="mr-4 text-xs">Edit Lineup</span>

      <div class="w-4 h-4">
        <EditIcon />
      </div>
    </router-link>

    <div v-if="isLineupSet" class="flex flex-wrap justify-center mt-8">
      <div
        v-for="{ id, name, headshotUrl } in lineupContestants"
        :key="id"
        class="flex flex-col items-center m-2"
      >
        <div class="w-24 h-24 mb-2 overflow-hidden rounded-full">
          <img :src="headshotUrl" />
        </div>

        <span class="txt-body">{{ name }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, toRefs } from "vue";

import AlertIcon from "@/assets/alert.svg";
import EditIcon from "@/assets/edit.svg";
import { LeagueContext } from "@/types";
import { useLineupContestants } from "@/composables";

const Lineup = defineComponent({
  name: "Lineup",

  components: {
    AlertIcon,
    EditIcon,
  },

  props: {
    leagueContext: {
      type: Object as PropType<LeagueContext>,
      required: true,
    },
  },

  setup(props) {
    const { leagueContext } = toRefs(props);
    const { leagueMemberId, currentSeasonWeekId } = leagueContext.value;

    const { lineupContestants } = useLineupContestants(
      ref(leagueMemberId),
      ref(currentSeasonWeekId),
      "no-cache"
    );

    const isLineupSet = computed(() => lineupContestants.value.length > 0);

    return {
      isLineupSet,
      lineupContestants,
    };
  },
});

export default Lineup;
</script>
