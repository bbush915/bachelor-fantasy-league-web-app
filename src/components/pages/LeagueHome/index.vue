<template>
  <div class="flex flex-col items-center">
    <div class="self-start mt-2 ml-40">
      <span class="text-sm font-thin text-pink">{{ league.name }}</span>
      <h1 class="mb-6 text-3xl">League Home</h1>
    </div>

    <div class="flex flex-col w-3/5 mb-8 space-y-6">
      <MyLineup class="w-full" />
      <Leaderboard />

      <div class="flex w-full space-x-6">
        <MemberScores class="w-1/2" />
        <ContestantScores class="w-1/2" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import ContestantScores from "./ContestantScores/index.vue";
import Leaderboard from "./Leaderboard/index.vue";
import MemberScores from "./MemberScores/index.vue";
import MyLineup from "./MyLineup/index.vue";

const LeagueHome = defineComponent({
  name: "LeagueHome",

  components: {
    ContestantScores,
    Leaderboard,
    MemberScores,
    MyLineup,
  },

  setup() {
    const league = {
      name: "Dialexa",
    };

    return {
      league,
    };
  },
});

export default LeagueHome;
</script>