import { useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";

type TResult = {
  activeSeason: {
    id: string;
    currentSeasonWeek: {
      id: string;
      episodeAirDate: string;
    };
  };
};

export function useCurrentSeasonWeek() {
  const { result } = useQuery<TResult>(
    gql`
      query CurrentSeasonWeek {
        activeSeason {
          id
          currentSeasonWeek {
            id
            episodeAirDate
          }
        }
      }
    `
  );

  const currentSeasonWeek = useResult(result, null, (data) => data.activeSeason.currentSeasonWeek);

  return {
    currentSeasonWeek,
  };
}
