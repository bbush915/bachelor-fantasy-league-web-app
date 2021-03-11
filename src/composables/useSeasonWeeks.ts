import { useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";

export interface ISeasonWeek {
  id: string;
  weekNumber: number;
}

function useSeasonWeeks(seasonId: string) {
  const { result } = useQuery(
    gql`
      query SeasonWeeks($seasonId: String!) {
        seasonWeeks(seasonId: $seasonId) {
          id
          weekNumber
        }
      }
    `,
    {
      seasonId,
    }
  );

  const seasonWeeks = useResult<any, null, ISeasonWeek[]>(result, null, (data) => data.seasonWeeks);

  return {
    seasonWeeks,
  };
}

export default useSeasonWeeks;
