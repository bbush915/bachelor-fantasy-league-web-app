import { useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { computed, reactive, Ref } from "vue";

type TResult = {
  seasonWeeks: {
    id: string;
    weekNumber: number;
  }[];
};

export function useSeasonWeeks(seasonId: Ref<string | undefined>) {
  const isQueryEnabled = computed(() => !!seasonId.value);

  const { result } = useQuery<TResult>(
    gql`
      query SeasonWeeks($seasonId: ID!) {
        seasonWeeks(seasonId: $seasonId) {
          id
          weekNumber
        }
      }
    `,
    { seasonId },
    reactive({
      enabled: isQueryEnabled,
    })
  );

  const seasonWeeks = useResult(result, [] as TResult["seasonWeeks"], (data) =>
    data.seasonWeeks.slice(0).sort((x, y) => x.weekNumber - y.weekNumber)
  );

  return {
    seasonWeeks,
  };
}
