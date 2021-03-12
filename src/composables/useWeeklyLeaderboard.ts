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
  lineup: { id: string; name: string; headshotUrl: string; score: number }[];
}

export function useWeeklyLeaderboard(leagueId: string, seasonWeekId: Ref<string | undefined>) {
  const { result } = useQuery(
    gql`
      query WeeklyLeaderboard($leagueId: String!, $seasonWeekId: String!) {
        weeklyScoreDetails(leagueId: $leagueId, seasonWeekId: $seasonWeekId) {
          id
          user {
            id
            displayName
            avatarUrl
          }
          lineup(seasonWeekId: $seasonWeekId) {
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
          weeklyScore
        }
      }
    `,
    { leagueId, seasonWeekId }
  );

  const leagueMembers = useResult<any, [], ILeagueMember[]>(result, [], (data) => {
    return data.weeklyScoreDetails
      .sort((x: any, y: any) => y.weeklyScore - x.weeklyScore)
      .map((x: any, index: number) => ({
        userId: x.user.id,
        ordinal: getOrdinal(index + 1),
        avatarUrl: x.user.avatarUrl,
        displayName: x.user.displayName,
        score: x.weeklyScore,
        lineup: x.lineup.lineupContestants
          .sort((x: any, y: any) => x.contestant.name.localeCompare(y.contestant.name))
          .map((x: any) => ({
            id: x.id,
            name: x.contestant.name,
            headshotUrl: x.contestant.headshotUrl,
            score: x.score,
          })),
      }));
  });

  return {
    leagueMembers,
  };
}
