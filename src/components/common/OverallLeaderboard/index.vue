<template>
  <transition-group class="py-8 pr-8 space-y-8" name="league-member-list" tag="div">
    <div
      v-for="leagueMember in leagueMembers"
      :key="leagueMember.id"
      class="flex items-center justify-between h-10 pl-8 pr-4 league-member"
      :style="{ width: `${leagueMember.normalizedWidth}%` }"
    >
      <div class="flex items-center">
        <span class="w-8 txt-body">{{ leagueMember.ordinal }}</span>

        <div class="w-16 h-16 mx-6 overflow-hidden rounded-full">
          <img :src="leagueMember.avatarUrl" />
        </div>

        <span class="txt-body">
          {{ leagueMember.id === leagueMemberId ? "You" : leagueMember.displayName }}
        </span>
      </div>

      <span class="txt-body">{{ leagueMember.score }}</span>
    </div>
  </transition-group>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from "vue";

import { useOverallLeaderboard } from "@/composables";
import { LeagueContext } from "@/types";

const OverallLeaderboard = defineComponent({
  name: "OverallLeaderboard",

  props: {
    leagueContext: {
      type: Object as PropType<LeagueContext>,
      required: true,
    },

    weekNumber: {
      type: Number,
      required: true,
    },

    condensed: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  setup(props) {
    const { leagueContext, condensed, weekNumber } = toRefs(props);
    const { leagueId, leagueMemberId } = leagueContext.value;

    const { leagueMembers } = useOverallLeaderboard(leagueId, weekNumber);

    const filteredLeagueMembers = computed(() => {
      if (condensed.value) {
        return leagueMembers.value.filter(
          (leagueMember, index) => leagueMember.id === leagueMemberId || index < 3
        );
      }

      return leagueMembers.value;
    });

    return {
      leagueMembers: filteredLeagueMembers,
      leagueMemberId,
    };
  },
});

export default OverallLeaderboard;
</script>

<style scoped>
.league-member-list-move {
  transition: transform 1s ease;
}

.league-member {
  background: linear-gradient(270deg, rgba(226, 28, 52, 0.85) -10%, rgba(226, 28, 52, 0.1) 130%);
}
</style>
