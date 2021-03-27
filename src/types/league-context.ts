export type LeagueContext = {
  leagueId: string;
  leagueName: string;
  leagueMemberId: string;
  seasonId: string;
  weekNumber: number;
  isComplete: boolean;
  currentSeasonWeekId: string;
  lineupSpotsAvailable: number;
  previousSeasonWeekId?: string;
};
