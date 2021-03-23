import { useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";

type TResult = {
  seasonWeeks: {
    id: string;
    weekNumber: number;
  }[];
};

export function useSeasonWeeks(seasonId: string) {
  const { result } = useQuery<TResult>(
    gql`
      query SeasonWeeks($seasonId: ID!) {
        seasonWeeks(seasonId: $seasonId) {
          id
          weekNumber
        }
      }
    `,
    { seasonId }
  );

  const seasonWeeks = useResult(result, [] as TResult["seasonWeeks"], (data) =>
    data.seasonWeeks.slice(0).sort((x, y) => x.weekNumber - y.weekNumber)
  );

  return {
    seasonWeeks,
  };
}
