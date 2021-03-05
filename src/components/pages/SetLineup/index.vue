<template>
  <div class="flex flex-col items-center pb-8">
    <div class="flex flex-col self-start my-6 ml-40">
      <span class="mb-1 text-sm font-thin text-pink">
        {{ league?.name ?? "" }}
      </span>

      <h1 class="text-3xl">Set Lineup</h1>
    </div>

    <div class="relative flex flex-col w-3/4 p-8 mb-8 bg-gray-dark rounded-xl">
      <h2 class="mb-4 text-lg">Select who you think deserves a rose.</h2>

      <div class="flex flex-col items-start">
        <span class="my-2 text-sm font-thin"
          >{{ rosesRemaining }} roses left</span
        >

        <div class="flex flex-wrap mb-8">
          <div v-for="i in rosesRemaining" :key="i" class="w-12 h-12">
            <RoseIcon />
          </div>
        </div>
      </div>

      <div class="flex flex-wrap justify-center mb-8">
        <div
          v-for="(contestant, index) in contestants"
          :key="index"
          class="relative flex flex-col items-center p-2 mx-1 my-3"
        >
          <button
            class="absolute top-0 right-0"
            @click="showContestantModal(contestant)"
          >
            <InfoIcon />
          </button>

          <button
            class="relative w-24 h-24 mb-3 overflow-hidden rounded-full focus:outline-none contestant"
            @click="toggleContestant(contestant)"
            :class="{
              selected: contestant.isSelected,
            }"
          >
            <img :src="contestant.imageUrl" />

            <div v-if="contestant.isSelected" class="absolute bottom-0 w-14">
              <RoseIcon />
            </div>
          </button>

          <span class="text-sm font-thin">{{ contestant.name }}</span>
        </div>
      </div>

      <div class="self-end">
        <button class="mr-4 btn-secondary">Cancel</button>
        <button class="btn-primary" @click="handleSaveClick">Save</button>
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
import { computed, defineComponent, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import InfoIcon from "@/assets/info.svg";
import RoseIcon from "@/assets/rose.svg";
import ContestantModal from "@/components/simple/ContestantModal/index.vue";
import { useContestantModal } from "@/composables";
import { IContestant } from "@/composables/useContestants";

const SetLineup = defineComponent({
  name: "SetLineup",

  components: {
    ContestantModal,
    InfoIcon,
    RoseIcon,
  },

  setup() {
    const router = useRouter();
    const route = useRoute();

    const { result } = useQuery(
      gql`
        query SetLineup($leagueId: String!, $seasonWeekId: String!) {
          lineup(leagueId: $leagueId, seasonWeekId: $seasonWeekId) {
            lineupContestants {
              contestantId
            }
          }
          league(id: $leagueId) {
            id
            name
            season {
              id
              currentSeasonWeek {
                id
                lineupSpotsAvailable
                seasonWeekContestants {
                  id
                  contestant {
                    id
                    name
                    imageUrl
                    age
                    occupation
                    hometown
                    bio
                    trivia
                  }
                }
              }
            }
          }
        }
      `,
      {
        leagueId: route.params.leagueId,
        seasonWeekId: route.params.seasonWeekId,
      },
      {
        fetchPolicy: "no-cache",
      }
    );

    const { mutate: saveLineup } = useMutation(
      gql`
        mutation SaveLineup($input: SaveLineupInput!) {
          saveLineup(input: $input) {
            id
          }
        }
      `
    );

    const league = useResult(result, null, (data) => data.league);
    const contestantIds = useResult(result, null, (data) =>
      data.lineup?.lineupContestants.map((x: any) => x.contestantId)
    );

    const contestants_ = useResult<any, null, IContestant[]>(
      result,
      null,
      (data) =>
        data.league.season.currentSeasonWeek.seasonWeekContestants.map(
          (x: any) => x.contestant
        )
    );

    const {
      selectedContestant,
      isContestantModalVisible,
      showContestantModal,
      hideContestantModal,
    } = useContestantModal();

    const rosesRemaining = ref(0);

    const contestants = computed(
      () =>
        contestants_.value?.map((x) => ({
          ...x,
          isSelected:
            contestantIds.value?.some((y: any) => y === x.id) ?? false,
        })) ?? []
    );

    watch(
      () => league.value,
      () => {
        rosesRemaining.value =
          league.value?.season.currentSeasonWeek.lineupSpotsAvailable -
          contestants.value.filter((x) => x.isSelected).length;
      }
    );

    function toggleContestant(
      contestant: IContestant & { isSelected: boolean }
    ) {
      if (contestant.isSelected) {
        contestant.isSelected = false;
        rosesRemaining.value++;
      } else if (rosesRemaining.value > 0) {
        contestant.isSelected = true;
        rosesRemaining.value--;
      }
    }

    async function handleSaveClick(): Promise<void> {
      await saveLineup({
        input: {
          leagueId: league.value.id,
          seasonWeekId: league.value.season.currentSeasonWeek.id,
          contestantIds: contestants.value
            .filter((x) => x.isSelected)
            .map((x) => x.id),
        },
      });

      router.push({ name: "league-home" });
    }

    return {
      league,
      contestants,
      selectedContestant,
      isContestantModalVisible,
      showContestantModal,
      hideContestantModal,
      rosesRemaining,
      toggleContestant,
      handleSaveClick,
    };
  },
});

export default SetLineup;
</script>

<style lang="postcss" scoped>
.contestant {
  &.selected {
    box-shadow: 0px 0px 8px 8px #e21c34;
  }
}
</style>