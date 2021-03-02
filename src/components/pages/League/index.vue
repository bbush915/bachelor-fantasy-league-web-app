<template>
  <div class="flex flex-col items-center">
    <div class="self-start mt-3 mb-1 ml-40">
      <span class="text-sm font-thin text-pink">{{ league?.name ?? "" }}</span>
    </div>

    <router-view class="w-full" />
  </div>
</template>

<script lang="ts">
import { useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { defineComponent } from "vue";
import { useRoute } from "vue-router";

const League = defineComponent({
  name: "League",

  setup() {
    const route = useRoute();

    const { result } = useQuery(
      gql`
        query Leauge($id: String!) {
          league(id: $id) {
            id
            name
            season {
              id
              currentWeek {
                id
                weekNumber
                episodeAirDate
                lineupSpotsAvailable
              }
            }
          }
        }
      `,
      {
        id: route.params.id,
      }
    );

    const league = useResult(result, null, (data) => data.league);

    return {
      league,
    };
  },
});

export default League;
</script>