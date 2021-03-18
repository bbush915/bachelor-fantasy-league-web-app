import { useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { computed, reactive, Ref } from "vue";

import { getOrdinal } from "@/utils";

type TResult = {
  league: {
    leagueMembers: {
      id: string;
      isActive: boolean;
      user: {
        id: string;
        displayName: string;
        avatarUrl: string;
      };
      leagueMemberScore: {
        leagueMemberId: string;
        seasonWeekId: string;
        weeklyScore?: number;
        weeklyRank?: number;
        cumulativeScore?: number;
        cumulativeRank?: number;
      };
    }[];
  };
};

type OverallLeaderboardEntry = {
  leagueMemberId: string;
  ordinal: string;
  avatarUrl: string;
  displayName: string;
  score: string;
  widthFactor: number;
};

export function useOverallLeaderboard(leagueId: string, seasonWeekId: Ref<string | undefined>) {
  const isQueryEnabled = computed(() => !!seasonWeekId.value);

  const { result } = useQuery<TResult>(
    gql`
      query OverallLeaderboard($leagueId: String!, $seasonWeekId: String!) {
        league(id: $leagueId) {
          id
          leagueMembers {
            id
            isActive
            user {
              id
              displayName
              avatarUrl
            }
            leagueMemberScore(seasonWeekId: $seasonWeekId) {
              leagueMemberId
              seasonWeekId
              weeklyScore
              weeklyRank
              cumulativeScore
              cumulativeRank
            }
          }
        }
      }
    `,
    { leagueId, seasonWeekId },
    reactive({
      enabled: isQueryEnabled,
    })
  );

  const leaderboardEntries = useResult(result, [] as OverallLeaderboardEntry[], (data) => {
    const leagueMembers = data.league.leagueMembers.filter((x) => x.isActive);

    let minScore = Number.MAX_VALUE;
    let maxScore = Number.MIN_VALUE;

    for (const leagueMember of leagueMembers) {
      const { cumulativeScore } = leagueMember.leagueMemberScore;

      if (cumulativeScore) {
        if (cumulativeScore < minScore) minScore = cumulativeScore;
        if (cumulativeScore > maxScore) maxScore = cumulativeScore;
      }
    }

    return leagueMembers
      .slice(0)
      .sort((x, y) => {
        const rankComparison =
          (x.leagueMemberScore.cumulativeRank ?? Number.MAX_VALUE) -
          (y.leagueMemberScore.cumulativeRank ?? Number.MAX_VALUE);

        if (rankComparison === 0) {
          return x.user.displayName.localeCompare(y.user.displayName);
        } else {
          return rankComparison;
        }
      })
      .map(
        (leagueMember) =>
          ({
            leagueMemberId: leagueMember.id,
            ordinal: leagueMember.leagueMemberScore.cumulativeRank
              ? getOrdinal(leagueMember.leagueMemberScore.cumulativeRank)
              : "-",
            avatarUrl: leagueMember.user.avatarUrl,
            displayName: leagueMember.user.displayName,
            score: leagueMember.leagueMemberScore.cumulativeScore ?? "-",
            widthFactor: getWidthFactor(
              minScore,
              maxScore,
              leagueMember.leagueMemberScore.cumulativeScore
            ),
          } as OverallLeaderboardEntry)
      );
  });

  return {
    leaderboardEntries,
  };
}

function getWidthFactor(min: number, max: number, value?: number): number {
  if (!value) {
    return 0.33;
  }

  return 0.33 + 0.67 * ((value - min) / (max - min));
}
