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
        v-if="!isLocked"
        class="btn-primary"
        :to="{
          name: 'set-lineup',
        }"
      >
        Set Lineup
      </router-link>
    </div>

    <div v-if="isLocked" class="absolute flex items-center top-8 right-8">
      <span class="mr-3 text-xs">Locked</span>

      <div class="w-4 h-4 mb-1">
        <LockIcon />
      </div>
    </div>

    <router-link
      v-if="isLineupSet && !isLocked"
      class="absolute flex items-center top-8 right-8"
      :to="{
        name: 'set-lineup',
      }"
    >
      <span class="mr-3 text-xs">Edit Lineup</span>

      <div class="w-4 h-4">
        <EditIcon />
      </div>
    </router-link>

    <div v-if="isLineupSet" class="flex flex-wrap justify-center mt-8">
      <div
        v-for="{ id, name, headshotUrl, isFavorite } in lineupContestants"
        :key="id"
        class="relative flex flex-col items-center m-2"
      >
        <FavoriteIndicator
          v-if="isFavorite"
          class="absolute top-0 left-0 z-10 w-6 h-6"
          :checked="isFavorite"
        />

        <Avatar class="w-24 h-24 mb-2" :src="headshotUrl" />

        <span class="txt-body">{{ name }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, PropType, ref, toRefs } from "vue";

  import AlertIcon from "@/assets/alert.svg";
  import EditIcon from "@/assets/edit.svg";
  import LockIcon from "@/assets/lock.svg";
  import Avatar from "@/components/common/Avatar/index.vue";
  import FavoriteIndicator from "@/components/common/FavoriteIndicator/index.vue";
  import { useCurrentSeasonWeek, useLineupContestants, useUserFavorites } from "@/composables";
  import { LeagueContext } from "@/types";

  const Lineup = defineComponent({
    components: {
      AlertIcon,
      Avatar,
      EditIcon,
      FavoriteIndicator,
      LockIcon,
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

      const { lineupContestants: lineupContestants_ } = useLineupContestants(
        ref(leagueMemberId),
        ref(currentSeasonWeekId),
        "no-cache"
      );

      const { userFavorites } = useUserFavorites();

      const lineupContestants = computed(() =>
        lineupContestants_.value.map((lineupContestant) => ({
          ...lineupContestant,
          isFavorite: userFavorites.value.some(
            (userFavorite) => userFavorite.contestantId === lineupContestant.contestantId
          ),
        }))
      );

      const isLineupSet = computed(() => lineupContestants_.value.length > 0);

      const { currentSeasonWeek } = useCurrentSeasonWeek();

      const isLocked = computed(
        () =>
          currentSeasonWeek.value?.episodeAirDate &&
          new Date(currentSeasonWeek.value.episodeAirDate) < new Date()
      );

      return {
        isLineupSet,
        lineupContestants,
        isLocked,
      };
    },
  });

  export default Lineup;
</script>
