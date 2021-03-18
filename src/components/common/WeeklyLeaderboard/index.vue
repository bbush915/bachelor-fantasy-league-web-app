<template>
  <div>
    <component
      :is="condensed ? 'div' : 'button'"
      v-for="leaderboardEntry in leaderboardEntries"
      :key="leaderboardEntry.leagueMemberId"
      :class="{ selected: leaderboardEntry.leagueMemberId === selectedLeagueMemberId }"
      class="flex items-center justify-between w-full px-8 py-1 league-member"
      @click="
        condensed
          ? undefined
          : $emit('update:selectedLeagueMemberId', leaderboardEntry.leagueMemberId)
      "
    >
      <div class="flex items-center">
        <span class="w-8 txt-body">{{ leaderboardEntry.ordinal }}</span>

        <Avatar class="w-16 h-16 mx-6" :src="leaderboardEntry.avatarUrl" />

        <span class="txt-body">
          {{
            leaderboardEntry.leagueMemberId === leagueMemberId
              ? "You"
              : leaderboardEntry.displayName
          }}
        </span>
      </div>

      <span class="txt-body">
        {{ leaderboardEntry.score }}
      </span>
    </component>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRef, toRefs } from "vue";

import Avatar from "@/components/common/Avatar/index.vue";
import { useWeeklyLeaderboard } from "@/composables";
import { LeagueContext } from "@/types";

const WeeklyLeaderboard = defineComponent({
  name: "WeeklyLeaderboard",

  components: {
    Avatar,
  },

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

    const { leaderboardEntries } = useWeeklyLeaderboard(leagueId, seasonWeekId);

    const filteredLeaderboardEntries = computed(() => {
      if (condensed.value) {
        return leaderboardEntries.value.filter(
          (leaderboardEntry, index) =>
            leaderboardEntry.leagueMemberId === leagueMemberId || index < 3
        );
      }

      return leaderboardEntries.value;
    });

    return {
      leaderboardEntries: filteredLeaderboardEntries,
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
