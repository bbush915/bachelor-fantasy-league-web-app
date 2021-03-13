import { useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { computed, reactive, Ref } from "vue";

import { getOrdinal } from "@/utils";

type TResult = {
  weeklyScoreDetails: {
    id: string;
    user: {
      id: string;
      displayName: string;
      avatarUrl: string;
    };
    weeklyScore: number;
  }[];
};

export function useWeeklyLeaderboard(leagueId: string, seasonWeekId: Ref<string | undefined>) {
  const isQueryEnabled = computed(() => !!seasonWeekId.value);

  const { result } = useQuery<TResult>(
    gql`
      query WeeklyLeaderboard($leagueId: String!, $seasonWeekId: String!) {
        weeklyScoreDetails(leagueId: $leagueId, seasonWeekId: $seasonWeekId) {
          id
          user {
            id
            displayName
            avatarUrl
          }
          weeklyScore
        }
      }
    `,
    { leagueId, seasonWeekId },
    reactive({
      enabled: isQueryEnabled,
    })
  );

  const leagueMembers = useResult(result, [] as TResult["weeklyScoreDetails"], (data) => {
    const leagueMembers = data.weeklyScoreDetails;

    const scores = leagueMembers
      .map((leagueMember) => leagueMember.weeklyScore)
      .sort((x, y) => y - x);

    return leagueMembers
      .slice(0)
      .sort((x, y) => {
        const scoreComparison = y.weeklyScore - x.weeklyScore;

        if (scoreComparison === 0) {
          return x.user.displayName.localeCompare(y.user.displayName);
        } else {
          return scoreComparison;
        }
      })
      .map((leagueMember) => ({
        id: leagueMember.id,
        ordinal: getOrdinal(scores.findIndex((x) => x === leagueMember.weeklyScore) + 1),
        avatarUrl: leagueMember.user.avatarUrl,
        displayName: leagueMember.user.displayName,
        score: leagueMember.weeklyScore,
      }));
  });

  return {
    leagueMembers,
  };
}
