import { FetchPolicy } from "@apollo/client/core";
import { useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { computed, reactive, Ref } from "vue";

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
      score?: number;
    }[];
  };
};

interface ILineupContestant {
  id: string;
  contestantId: string;
  name: string;
  headshotUrl: string;
  score?: number;
}

export function useLineupContestants(
  leagueMemberId: Ref<string>,
  seasonWeekId: Ref<string | undefined>,
  fetchPolicy: FetchPolicy = "cache-first"
) {
  const isQueryEnabled = computed(() => !!seasonWeekId.value);

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
    { leagueMemberId, seasonWeekId },
    reactive({ fetchPolicy, enabled: isQueryEnabled })
  );

  const lineupContestants = useResult(result, [] as ILineupContestant[], (data) =>
    data.lineup.lineupContestants
      .slice(0)
      .sort((x, y) => x.contestant.name.localeCompare(y.contestant.name))
      .map<ILineupContestant>((lineupContestant) => ({
        id: lineupContestant.id,
        contestantId: lineupContestant.contestant.id,
        name: lineupContestant.contestant.name,
        headshotUrl: lineupContestant.contestant.headshotUrl,
        score: lineupContestant.score,
      }))
  );

  return {
    lineupContestants,
  };
}
