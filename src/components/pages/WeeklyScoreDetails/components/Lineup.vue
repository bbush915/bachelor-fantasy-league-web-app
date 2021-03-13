<template>
  <div class="px-8">
    <div
      v-for="{ id, headshotUrl, name, score } in lineupContestants"
      :key="id"
      class="flex items-center justify-between py-1"
    >
      <div class="flex items-center">
        <div class="w-16 h-16 mr-6 overflow-hidden rounded-full">
          <img :src="headshotUrl" />
        </div>

        <span class="txt-body">
          {{ name }}
        </span>
      </div>

      <span class="txt-body">
        {{ score }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { computed, defineComponent, reactive, toRef, toRefs } from "vue";

type TResult = {
  lineup: {
    id: string;
    lineupContestants: {
      id: string;
      contestant: {
        id: string;
        name: string;
        headshotUrl: string;
      };
      score: number;
    }[];
  };
};

const Lineup = defineComponent({
  name: "Lineup",

  props: {
    selectedLeagueMemberId: {
      type: String,
      required: true,
    },

    selectedSeasonWeekId: {
      type: String,
      required: false,
    },
  },

  setup(props) {
    const { selectedLeagueMemberId } = toRefs(props);
    const selectedSeasonWeekId = toRef(props, "selectedSeasonWeekId");

    const isQueryEnabled = computed(() => !!selectedSeasonWeekId.value);

    const { result } = useQuery<TResult>(
      gql`
        query Lineup($leagueMemberId: String!, $seasonWeekId: String!) {
          lineup(leagueMemberId: $leagueMemberId, seasonWeekId: $seasonWeekId) {
            id
            lineupContestants {
              id
              contestant {
                id
                name
                headshotUrl
              }
              score(seasonWeekId: $seasonWeekId)
            }
          }
        }
      `,
      { leagueMemberId: selectedLeagueMemberId, seasonWeekId: selectedSeasonWeekId },
      reactive({ fetchPolicy: "cache-first", enabled: isQueryEnabled })
    );

    const lineupContestants = useResult(result, [], (data) =>
      data.lineup.lineupContestants
        .slice(0)
        .sort((x, y) => x.contestant.name.localeCompare(y.contestant.name))
        .map((lineupContestant) => ({
          id: lineupContestant.id,
          name: lineupContestant.contestant.name,
          headshotUrl: lineupContestant.contestant.headshotUrl,
          score: lineupContestant.score,
        }))
    );

    return {
      lineupContestants,
    };
  },
});

export default Lineup;
</script>
