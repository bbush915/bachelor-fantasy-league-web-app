import { useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { computed, reactive, ref, Ref, watch } from "vue";

type TResult = {
  seasonWeekContestants: {
    id: string;
    contestant: {
      id: string;
      headshotUrl: string;
      name: string;
    };
    rose: boolean;
    specialRose: boolean;
    groupDate: boolean;
    oneOnOneDate: boolean;
    twoOnOneDate: boolean;
    sentHome: boolean;
    score: number;
  }[];
};

export function useSeasonWeekContestants(seasonWeekId: Ref<string | undefined>) {
  const isQueryEnabled = computed(() => !!seasonWeekId.value);

  const { result } = useQuery<TResult>(
    gql`
      query ContestantScoreDetails($seasonWeekId: ID!) {
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
    { seasonWeekId },
    reactive({
      enabled: isQueryEnabled,
    })
  );

  const seasonWeekContestants_ = useResult(result, [] as TResult["seasonWeekContestants"], (data) =>
    data.seasonWeekContestants
      .slice(0)
      .sort((x, y) => x.contestant.name.localeCompare(y.contestant.name))
  );

  const seasonWeekContestants = ref<any[]>([]);

  watch(
    () => seasonWeekContestants_.value,
    () => {
      if (seasonWeekContestants_.value) {
        seasonWeekContestants.value.splice(0, seasonWeekContestants.value.length);

        seasonWeekContestants.value.push(
          ...JSON.parse(JSON.stringify(seasonWeekContestants_.value))
        );
      }
    }
  );

  return {
    seasonWeekContestants,
  };
}
