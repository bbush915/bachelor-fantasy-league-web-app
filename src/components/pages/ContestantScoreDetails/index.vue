<template>
  <div class="flex flex-col">
    <div class="flex items-center justify-between w-full mb-10">
      <h1>Contestant Score Breakdown</h1>

      <select v-model="selectedWeekNumber" class="font-light w-28">
        <option disabled>Select Week Number</option>
        <option
          v-for="seasonWeek in filteredSeasonWeeks"
          :key="seasonWeek.id"
          :value="seasonWeek.weekNumber"
        >
          Week {{ seasonWeek.weekNumber }}
        </option>
      </select>
    </div>

    <table class="text-center">
      <thead>
        <tr class="h-16">
          <th />
          <th class="text-left">Contestant</th>
          <th>Received Rose</th>
          <th>
            <div class="flex items-center justify-center">
              <span class="mr-2">Rose Bonus</span>
              <InfoIcon v-tooltip="'Contestant received a rose outside of a rose ceremony'" />
            </div>
          </th>
          <th>Group Date</th>
          <th>1 on 1 Date</th>
          <th>2 on 1 Date</th>
          <th>
            <div class="flex items-center justify-center">
              <span class="mr-2">Sent Home</span>
              <InfoIcon v-tooltip="'Contestant left or went home outside of a rose ceremony'" />
            </div>
          </th>
          <th class="pr-4 text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(seasonWeekContestant, index) in seasonWeekContestants"
          :key="seasonWeekContestant.id"
          :class="{ 'bg-gray-dark': index % 2 === 0 }"
          class="txt-body"
        >
          <td>
            <div class="w-16 h-16 my-2 ml-4 overflow-hidden rounded-full">
              <img :src="seasonWeekContestant.contestant.headshotUrl" />
            </div>
          </td>
          <td class="text-left">
            {{ seasonWeekContestant.contestant.name }}
          </td>
          <td>
            {{ seasonWeekContestant.rose ? `+${selectedWeekNumber}` : "-" }}
          </td>
          <td>
            {{ seasonWeekContestant.specialRose ? "+5" : "-" }}
          </td>
          <td>
            {{ seasonWeekContestant.groupDate ? "+5" : "-" }}
          </td>
          <td>
            {{ seasonWeekContestant.oneOnOneDate ? "+10" : "-" }}
          </td>
          <td>
            {{ seasonWeekContestant.twoOnOneDate ? "-5" : "-" }}
          </td>
          <td>
            {{ seasonWeekContestant.sentHome ? "-10" : "-" }}
          </td>
          <td class="text-right">
            <span class="pr-4">
              {{ seasonWeekContestant.score ?? "-" }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { computed, defineComponent, PropType, ref } from "vue";

import InfoIcon from "@/assets/info.svg";
import { useSeasonWeeks } from "@/composables";
import { LeagueContext } from "@/types";

const ContestantScoreDetails = defineComponent({
  name: "ContestantScoreDetails",

  components: {
    InfoIcon,
  },

  props: {
    leagueContext: {
      type: Object as PropType<LeagueContext>,
      required: true,
    },
  },

  setup({ leagueContext }) {
    const { seasonId, currentWeekNumber } = leagueContext;

    const selectedWeekNumber = ref(currentWeekNumber - 1);

    const { seasonWeeks } = useSeasonWeeks(seasonId);

    const filteredSeasonWeeks = computed(
      () => seasonWeeks.value?.filter((x) => x.weekNumber < currentWeekNumber) ?? []
    );

    const selectedSeasonWeekId = computed(
      () => filteredSeasonWeeks.value.find((x) => x.weekNumber === selectedWeekNumber.value)?.id
    );

    const { result } = useQuery(
      gql`
        query ContestantScoreDetails($seasonWeekId: String!) {
          seasonWeekContestants(seasonWeekId: $seasonWeekId) {
            id
            contestant {
              id
              headshotUrl
              name
            }
            rose
            specialRose
            groupDate
            oneOnOneDate
            twoOnOneDate
            sentHome
            score
          }
        }
      `,
      { seasonWeekId: selectedSeasonWeekId }
    );

    const seasonWeekContestants = useResult(result, null, (data) =>
      data.seasonWeekContestants.sort((x: any, y: any) =>
        x.contestant.name.localeCompare(y.contestant.name)
      )
    );

    return {
      filteredSeasonWeeks,
      selectedWeekNumber,
      seasonWeekContestants,
    };
  },
});

export default ContestantScoreDetails;
</script>

<style scoped>
select {
  background: transparent;
}
</style>
