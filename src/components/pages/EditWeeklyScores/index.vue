<template>
  <div class="flex flex-col mx-40 mt-10">
    <div class="flex flex-col mb-8">
      <div class="flex items-center justify-between w-full mb-10">
        <h1>Edit Weekly Scores</h1>

        <select v-model="selectedWeekNumber" class="w-28">
          <option disabled>Select Week Number</option>
          <option v-for="{ id, weekNumber } in seasonWeeks" :key="id" :value="weekNumber">
            Week {{ weekNumber }}
          </option>
        </select>
      </div>

      <EditableScoreTable
        :seasonWeekContestants="seasonWeekContestants"
        :updateSeasonWeekContestant="updateSeasonWeekContestant"
      />

      <div class="flex justify-end mt-8">
        <button class="btn-primary" @click="saveScores">Save</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { useMutation } from "@vue/apollo-composable";
  import gql from "graphql-tag";
  import { computed, defineComponent, ref, watch } from "vue";
  import { useStore } from "vuex";

  import { useActiveSeason, useSeasonWeekContestants, useSeasonWeeks } from "@/composables";
  import EditableScoreTable from "./components/EditableScoreTable/index.vue";

  type TScoreSeasonWeekContestantsResult = { scoreSeasonWeekContestants: { success: boolean } };

  type TScoreSeasonWeekContestantsVariables = {
    input: {
      scores: {
        id: string;
        seasonWeekId: string;
        rose: boolean;
        specialRose: boolean;
        groupDate: boolean;
        oneOnOneDate: boolean;
        twoOnOneDate: boolean;
        sentHome: boolean;
      }[];
    };
  };

  const EditWeeklyScores = defineComponent({
    components: {
      EditableScoreTable,
    },

    setup() {
      const store = useStore();

      const seasonId = ref<string | undefined>();
      const currrentWeekNumber = ref<number | undefined>();
      const selectedWeekNumber = ref<number | undefined>();
      const selectedSeasonWeekId = ref<string | undefined>();

      const { activeSeason } = useActiveSeason();

      watch(
        () => activeSeason.value,
        () => {
          if (!activeSeason.value) {
            return;
          }

          seasonId.value = activeSeason.value.id;
          currrentWeekNumber.value = activeSeason.value.currentWeekNumber;
          selectedWeekNumber.value = activeSeason.value.currentWeekNumber;
        }
      );

      const { seasonWeeks } = useSeasonWeeks(seasonId);

      const filteredSeasonWeeks = computed(() =>
        seasonWeeks.value.filter((x) => x.weekNumber < currrentWeekNumber.value! + 1)
      );

      watch([filteredSeasonWeeks, selectedWeekNumber], () => {
        selectedSeasonWeekId.value = filteredSeasonWeeks.value.find(
          (x) => x.weekNumber === selectedWeekNumber.value
        )?.id;
      });

      const { seasonWeekContestants } = useSeasonWeekContestants(selectedSeasonWeekId);

      const updateSeasonWeekContestant = (id: string, propertyName: string, value: boolean) => {
        const seasonWeekContestant = seasonWeekContestants.value.find((x: any) => x.id === id);

        if (seasonWeekContestant) {
          seasonWeekContestant[propertyName] = value;
        }
      };

      const { mutate: scoreSeasonWeekContestants } = useMutation<
        TScoreSeasonWeekContestantsResult,
        TScoreSeasonWeekContestantsVariables
      >(
        gql`
          mutation ScoreSeasonWeekContestants($input: ScoreSeasonWeekContestantsInput!) {
            scoreSeasonWeekContestants(input: $input) {
              id
              rose
              specialRose
              groupDate
              oneOnOneDate
              twoOnOneDate
              sentHome
              score
            }
          }
        `
      );

      const saveScores = async () => {
        try {
          await scoreSeasonWeekContestants({
            input: {
              scores: seasonWeekContestants.value.map((x) => ({
                id: x.id,
                seasonWeekId: selectedSeasonWeekId.value!,
                rose: !!x.rose,
                specialRose: !!x.specialRose,
                groupDate: !!x.groupDate,
                oneOnOneDate: !!x.oneOnOneDate,
                twoOnOneDate: !!x.twoOnOneDate,
                sentHome: !!x.sentHome,
              })),
            },
          });

          store.dispatch("pushNotification", {
            type: "success",
            message: "Saved scores successfully!",
          });
        } catch (error) {
          store.dispatch("pushNotification", {
            type: "error",
            message: "Failed to save scores.",
          });
        }
      };

      return {
        seasonWeeks: filteredSeasonWeeks,
        selectedWeekNumber,
        seasonWeekContestants,
        updateSeasonWeekContestant,
        saveScores,
      };
    },
  });

  export default EditWeeklyScores;
</script>

<style scoped>
  select {
    background: transparent;
  }
</style>
