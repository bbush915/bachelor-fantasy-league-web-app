<template>
  <div class="flex flex-col">
    <h1 class="mb-10">League Home</h1>

    <div class="flex flex-col px-40 space-y-8">
      <Lineup :leagueContext="leagueContext" />
      <OverallScores :leagueContext="leagueContext" />

      <div class="flex space-x-8">
        <WeeklyScores class="flex-1" :leagueContext="leagueContext" />
        <ContestantScores
          class="flex-1"
          :style="{ height: 'fit-content' }"
          :leagueContext="leagueContext"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import { LeagueContext } from "@/types";
import ContestantScores from "./ContestantScores/index.vue";
import Lineup from "./Lineup/index.vue";
import OverallScores from "./OverallScores/index.vue";
import WeeklyScores from "./WeeklyScores/index.vue";

const LeagueHome = defineComponent({
  name: "LeagueHome",

  components: {
    ContestantScores,
    Lineup,
    OverallScores,
    WeeklyScores,
  },

  props: {
    leagueContext: {
      type: Object as PropType<LeagueContext>,
      required: true,
    },
  },
});

export default LeagueHome;
</script>
