import { useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { Ref } from "vue";

import { getOrdinal } from "@/utils";

type TResult = {
  overallScoreDetails: {
    id: string;
    user: {
      id: string;
      displayName: string;
      avatarUrl: string;
    };
    cumulativeScore: number;
  }[];
};

export function useOverallLeaderboard(leagueId: string, weekNumber: Ref<number>) {
  const { result } = useQuery<TResult>(
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

  const leagueMembers = useResult(result, [] as TResult["overallScoreDetails"], (data) => {
    const leagueMembers = data.overallScoreDetails;

    let minScore = Number.MAX_VALUE;
    let maxScore = Number.MIN_VALUE;
    const scores: number[] = [];

    for (const leagueMember of leagueMembers) {
      if (leagueMember.cumulativeScore < minScore) minScore = leagueMember.cumulativeScore;
      if (leagueMember.cumulativeScore > maxScore) maxScore = leagueMember.cumulativeScore;

      scores.push(leagueMember.cumulativeScore);
    }

    scores.sort((x, y) => y - x);

    return leagueMembers
      .slice(0)
      .sort((x, y) => {
        const scoreComparison = y.cumulativeScore - x.cumulativeScore;

        if (scoreComparison === 0) {
          return x.user.displayName.localeCompare(y.user.displayName);
        } else {
          return scoreComparison;
        }
      })
      .map((leagueMember) => ({
        id: leagueMember.id,
        ordinal: getOrdinal(scores.findIndex((x) => x === leagueMember.cumulativeScore) + 1),
        avatarUrl: leagueMember.user.avatarUrl,
        displayName: leagueMember.user.displayName,
        score: leagueMember.cumulativeScore,
        normalizedWidth: getNormalizedWidth(minScore, maxScore, leagueMember.cumulativeScore),
      }));
  });

  return {
    leagueMembers,
  };
}

function getNormalizedWidth(min: number, max: number, value: number): number {
  return (0.33 + 0.67 * ((value - min) / (max - min))) * 100;
}
