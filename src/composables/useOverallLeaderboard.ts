import { useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { Ref } from "vue";

import { getOrdinal } from "@/utils";

interface ILeagueMember {
  userId: string;
  ordinal: string;
  avatarUrl: string;
  displayName: string;
  score: number;
  normalizedWidth: number;
}

export function useOverallLeaderboard(leagueId: string, weekNumber: Ref<number>) {
  const { result } = useQuery(
    gql`
      query OverallLeaderboard($leagueId: String!, $weekNumber: Int!) {
        overallScoreDetails(leagueId: $leagueId, weekNumber: $weekNumber) {
          id
          user {
            id
            displayName
            avatarUrl
          }
          cumulativeScore
        }
      }
    `,
    { leagueId, weekNumber }
  );

  const leagueMembers = useResult<any, [], ILeagueMember[]>(result, [], (data) => {
    const minScore = Math.min(...data.overallScoreDetails.map((x: any) => x.cumulativeScore));
    const maxScore = Math.max(...data.overallScoreDetails.map((x: any) => x.cumulativeScore));

    return data.overallScoreDetails
      .sort((x: any, y: any) => y.cumulativeScore - x.cumulativeScore)
      .map((x: any, index: number) => ({
        userId: x.user.id,
        ordinal: getOrdinal(index + 1),
        avatarUrl: x.user.avatarUrl,
        displayName: x.user.displayName,
        score: x.cumulativeScore,
        normalizedWidth: getNormalizedWidth(minScore, maxScore, x.cumulativeScore),
      }));
  });

  return {
    leagueMembers,
  };
}

function getNormalizedWidth(min: number, max: number, value: number): number {
  return (0.33 + 0.67 * ((value - min) / (max - min))) * 100;
}
