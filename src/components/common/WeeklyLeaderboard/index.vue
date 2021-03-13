<template>
  <div>
    <component
      :is="condensed ? 'div' : 'button'"
      v-for="leagueMember in leagueMembers"
      :key="leagueMember.id"
      :class="{ selected: leagueMember.id === selectedLeagueMemberId }"
      class="flex items-center justify-between w-full px-8 py-1 league-member"
      @click="condensed ? undefined : $emit('update:selectedLeagueMemberId', leagueMember.id)"
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

      <span class="txt-body">
        {{ leagueMember.score }}
      </span>
    </component>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRef, toRefs } from "vue";

import { useWeeklyLeaderboard } from "@/composables";
import { LeagueContext } from "@/types";

const WeeklyLeaderboard = defineComponent({
  name: "WeeklyLeaderboard",

  props: {
    leagueContext: {
      type: Object as PropType<LeagueContext>,
      required: true,
    },

    selectedSeasonWeekId: {
      type: String,
      required: false,
    },

    selectedLeagueMemberId: {
      type: String,
      required: false,
    },

    condensed: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  setup(props) {
    const { leagueContext, selectedLeagueMemberId, condensed } = toRefs(props);
    const seasonWeekId = toRef(props, "selectedSeasonWeekId");

    const { leagueId, leagueMemberId } = leagueContext.value;

    const { leagueMembers } = useWeeklyLeaderboard(leagueId, seasonWeekId);

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
      selectedLeagueMemberId,
    };
  },
});

export default WeeklyLeaderboard;
</script>

<style lang="postcss" scoped>
.league-member {
  @apply font-light text-sm;

  &.selected {
    @apply bg-gray-darkest font-semibold;
  }
}
</style>
