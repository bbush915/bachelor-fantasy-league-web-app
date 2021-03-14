export type LeagueContext = {
  seasonId: string;
  weekNumber: number;
  currentSeasonWeekId: string;
  lineupSpotsAvailable: number;
  previousSeasonWeekId?: string;
  leagueId: string;
  leagueName: string;
  leagueMemberId: string;
};
