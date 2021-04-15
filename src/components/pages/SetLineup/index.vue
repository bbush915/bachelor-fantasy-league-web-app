<template>
  <div class="flex flex-col">
    <h1 class="mb-10">Set Lineup</h1>

    <div class="relative flex flex-col p-8 bg-gray-dark rounded-xl">
      <h2 class="mb-4">Select who you think deserves a rose.</h2>

      <div class="flex flex-col items-start">
        <span class="my-2 txt-body">
          {{ rosesRemaining === 1 ? "1 rose" : `${rosesRemaining} roses` }}
          left
        </span>

        <div class="flex flex-wrap h-12 mb-8">
          <div v-for="i in rosesRemaining" :key="i" class="w-12 h-12">
            <RoseIcon />
          </div>
        </div>
      </div>

      <div class="flex flex-wrap justify-center mb-8">
        <div
          v-for="contestant in contestants"
          :key="contestant.id"
          class="relative flex flex-col items-center p-2 mx-1 my-3"
        >
          <FavoriteIndicator
            v-if="userFavorites.some((x) => x.contestantId === contestant.id)"
            class="absolute z-10 w-6 h-6 top-2 left-2"
            :checked="userFavorites.some((x) => x.contestantId === contestant.id)"
          />

          <button class="absolute top-0 right-0 w-4 h-4" @click="showContestantModal(contestant)">
            <InfoIcon />
          </button>

          <button
            class="relative w-24 h-24 mb-3 overflow-hidden rounded-full focus:outline-none contestant"
            @click="toggleContestant(contestant)"
            :class="{
              selected: contestant.isSelected,
            }"
          >
            <Avatar :src="contestant.headshotUrl" />

            <div v-if="contestant.isSelected" class="absolute bottom-0 w-14">
              <RoseIcon />
            </div>
          </button>

          <span class="txt-body">{{ contestant.name }}</span>
        </div>
      </div>

      <div class="flex self-end">
        <router-link class="mr-4 btn-secondary" :to="{ name: 'league-home' }"> Cancel </router-link>
        <button class="btn-primary" :disabled="!canSave" @click="handleSaveClick">Save</button>
      </div>
    </div>

    <ContestantModal
      v-if="isContestantModalVisible"
      :contestant="selectedContestant"
      :onClose="hideContestantModal"
    />
  </div>
</template>

<script lang="ts">
  import { useMutation, useQuery, useResult } from "@vue/apollo-composable";
  import gql from "graphql-tag";
  import { computed, defineComponent, PropType, ref, toRefs, watch } from "vue";
  import { useRouter } from "vue-router";
  import { useStore } from "vuex";

  import InfoIcon from "@/assets/info.svg";
  import RoseIcon from "@/assets/rose.svg";
  import Avatar from "@/components/common/Avatar/index.vue";
  import ContestantModal from "@/components/common/ContestantModal/index.vue";
  import FavoriteIndicator from "@/components/common/FavoriteIndicator/index.vue";
  import {
    IContestant,
    useContestantModal,
    useLineupContestants,
    useUserFavorites,
  } from "@/composables";
  import { LeagueContext } from "@/types";

  type TResult = {
    weeklyContestants: IContestant[];
  };

  const SetLineup = defineComponent({
    name: "SetLineup",

    components: {
      Avatar,
      ContestantModal,
      FavoriteIndicator,
      InfoIcon,
      RoseIcon,
    },

    props: {
      leagueContext: {
        type: Object as PropType<LeagueContext>,
        required: true,
      },
    },

    setup(props) {
      const { leagueContext } = toRefs(props);

      const {
        leagueId,
        leagueMemberId,
        currentSeasonWeekId,
        lineupSpotsAvailable,
      } = leagueContext.value;

      const router = useRouter();
      const store = useStore();

      const { result } = useQuery<TResult>(
        gql`
          query WeeklyContestants($seasonWeekId: ID!) {
            weeklyContestants(seasonWeekId: $seasonWeekId) {
              id
              name
              headshotUrl
              age
              occupation
              hometown
              bio
              trivia
            }
          }
        `,
        { seasonWeekId: currentSeasonWeekId },
        { fetchPolicy: "cache-first" }
      );

      const weeklyContestants = useResult(
        result,
        [] as TResult["weeklyContestants"],
        (data) => data.weeklyContestants
      );

      const { userFavorites } = useUserFavorites();

      const { lineupContestants } = useLineupContestants(
        ref(leagueMemberId),
        ref(currentSeasonWeekId),
        "no-cache"
      );

      const {
        selectedContestant,
        isContestantModalVisible,
        showContestantModal,
        hideContestantModal,
      } = useContestantModal();

      const { mutate: saveLineup } = useMutation(
        gql`
          mutation SaveLineup($input: SaveLineupInput!) {
            saveLineup(input: $input) {
              id
              lineupContestants {
                id
                contestant {
                  id
                  name
                  headshotUrl
                }
              }
            }
          }
        `
      );

      const contestants = computed(() => {
        return weeklyContestants.value.map((contestant) => ({
          ...contestant,
          isSelected: lineupContestants.value.some(
            (lineupContestant) => lineupContestant.contestantId === contestant.id
          ),
        }));
      });

      const rosesRemaining = ref(lineupSpotsAvailable - lineupContestants.value.length);

      const canSave = computed(() => rosesRemaining.value === 0);

      watch(
        () => lineupContestants.value,
        () => {
          rosesRemaining.value = lineupSpotsAvailable - lineupContestants.value.length;
        }
      );

      function toggleContestant(contestant: typeof contestants.value[number]) {
        if (contestant.isSelected) {
          contestant.isSelected = false;
          rosesRemaining.value++;
        } else if (rosesRemaining.value > 0) {
          contestant.isSelected = true;
          rosesRemaining.value--;
        }
      }

      async function handleSaveClick(): Promise<void> {
        try {
          await saveLineup({
            input: {
              leagueId,
              seasonWeekId: currentSeasonWeekId,
              contestantIds: contestants.value.filter((x) => x.isSelected).map((x) => x.id),
            },
          });

          store.dispatch("pushNotification", {
            type: "success",
            message: "Lineup set successfuly!",
          });

          router.push({ name: "league-home" });
        } catch (error) {
          store.dispatch("pushNotification", {
            type: "error",
            message: "Failed to set lineup. Try again later",
          });
        }
      }

      return {
        contestants,
        userFavorites,
        selectedContestant,
        isContestantModalVisible,
        showContestantModal,
        hideContestantModal,
        rosesRemaining,
        toggleContestant,
        canSave,
        handleSaveClick,
      };
    },
  });

  export default SetLineup;
</script>

<style lang="postcss" scoped>
  .contestant {
    transition: transform 0.1s ease;

    &.selected {
      box-shadow: 0px 0px 8px 8px #e21c34;
    }

    &:hover,
    &:focus {
      transform: scale(1.075);
    }
  }
</style>
