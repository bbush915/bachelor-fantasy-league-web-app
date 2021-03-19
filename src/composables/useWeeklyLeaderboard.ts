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

type WeeklyLeaderboardEntry = {
  leagueMemberId: string;
  ordinal: string;
  avatarUrl: string;
  displayName: string;
  score: string;
};

export function useWeeklyLeaderboard(leagueId: string, seasonWeekId: Ref<string | undefined>) {
  const isQueryEnabled = computed(() => !!seasonWeekId.value);

  const { result } = useQuery<TResult>(
    gql`
      query WeeklyLeaderboard($leagueId: ID!, $seasonWeekId: ID!) {
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

  const leaderboardEntries = useResult(result, [] as WeeklyLeaderboardEntry[], (data) => {
    const leagueMembers = data.league.leagueMembers.filter((x) => x.isActive);

    return leagueMembers
      .slice(0)
      .sort((x, y) => {
        const rankComparison =
          (x.leagueMemberScore.weeklyRank ?? Number.MAX_VALUE) -
          (y.leagueMemberScore.weeklyRank ?? Number.MAX_VALUE);

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
            ordinal: leagueMember.leagueMemberScore.weeklyRank
              ? getOrdinal(leagueMember.leagueMemberScore.weeklyRank)
              : "-",
            avatarUrl: leagueMember.user.avatarUrl,
            displayName: leagueMember.user.displayName,
            score: leagueMember.leagueMemberScore.weeklyScore ?? "-",
          } as WeeklyLeaderboardEntry)
      );
  });

  return {
    leaderboardEntries,
  };
}
