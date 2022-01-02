import { useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";

type TResult = {
  activeSeason: {
    id: string;
    currentWeekNumber: number;
    isComplete: boolean;
    currentSeasonWeek: {
      id: string;
      episodeAirDate: string;
    };
  };
};

export function useActiveSeason() {
  const { result } = useQuery<TResult>(
    gql`
      query ActiveSeason {
        activeSeason {
          id
          currentWeekNumber
          isComplete
          currentSeasonWeek {
            id
            episodeAirDate
          }
        }
      }
    `
  );

  const activeSeason = useResult(result, null, (data) => data.activeSeason);

  return {
    activeSeason,
  };
}
