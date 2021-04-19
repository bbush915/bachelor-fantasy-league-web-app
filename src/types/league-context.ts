export type LeagueContext = {
  leagueId: string;
  leagueName: string;
  isShareable: boolean;
  inviteLink?: string;
  leagueMemberId: string;
  isCommissioner: boolean;
  seasonId: string;
  weekNumber: number;
  isComplete: boolean;
  currentSeasonWeekId: string;
  lineupSpotsAvailable: number;
  previousSeasonWeekId?: string;
};
