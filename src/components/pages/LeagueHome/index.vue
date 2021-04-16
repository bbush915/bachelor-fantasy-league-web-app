<template>
  <div class="flex flex-col mb-8">
    <div class="flex justify-between mb-10 mr-40">
      <h1>League Home</h1>

      <router-link class="btn-secondary" :to="{ name: 'league-info' }">
        More Information
      </router-link>
    </div>

    <div class="flex flex-col mx-40 space-y-8">
      <FinalStandings v-if="leagueContext.isComplete" :leagueContext="leagueContext" />
      <Lineup v-else :leagueContext="leagueContext" />

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
  import ContestantScores from "./components/ContestantScores/index.vue";
  import FinalStandings from "./components/FinalStandings/index.vue";
  import Lineup from "./components/Lineup/index.vue";
  import OverallScores from "./components/OverallScores/index.vue";
  import WeeklyScores from "./components/WeeklyScores/index.vue";

  const LeagueHome = defineComponent({
    components: {
      ContestantScores,
      FinalStandings,
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
