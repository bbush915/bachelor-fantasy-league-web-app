<template>
  <transition-group class="py-8 pr-8 space-y-8" name="leaderboard" tag="div">
    <div
      v-for="leaderboardEntry in leaderboardEntries"
      :key="leaderboardEntry.leagueMemberId"
      class="flex items-center justify-between h-10 pl-8 pr-4 leaderboard-entry"
      :style="{ width: `${leaderboardEntry.widthFactor * 100}%` }"
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

      <span class="txt-body">{{ leaderboardEntry.score }}</span>
    </div>
  </transition-group>
</template>

<script lang="ts">
  import { computed, defineComponent, PropType, toRef, toRefs } from "vue";

  import Avatar from "@/components/common/Avatar/index.vue";
  import { useOverallLeaderboard } from "@/composables";
  import { LeagueContext } from "@/types";

  const OverallLeaderboard = defineComponent({
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

      condensed: {
        type: Boolean,
        required: false,
        default: false,
      },
    },

    setup(props) {
      const { leagueContext, condensed } = toRefs(props);
      const seasonWeekId = toRef(props, "selectedSeasonWeekId");

      const { leagueId, leagueMemberId } = leagueContext.value;

      const { leaderboardEntries } = useOverallLeaderboard(leagueId, seasonWeekId);

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
      };
    },
  });

  export default OverallLeaderboard;
</script>

<style scoped>
  .leaderboard-move {
    transition: transform 1s ease;
  }

  .leaderboard-entry {
    background: linear-gradient(270deg, rgba(226, 28, 52, 0.85) -10%, rgba(226, 28, 52, 0.1) 130%);
  }
</style>
