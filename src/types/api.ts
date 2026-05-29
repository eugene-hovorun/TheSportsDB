// ── TheSportsDB API response shapes ──────────────────────────────────────────

export interface Team {
  idTeam: string;
  strTeam: string;
  strLeague: string;
  strCountry: string;
  strLocation: string;
  strStadium: string | null;
  intStadiumCapacity: string | null;
  intFormedYear: string | null;
  strBadge: string | null;
  strFanart1: string | null;
  strDescriptionEN: string | null;
  strManager: string | null;
  strWebsite: string | null;
  strTwitter: string | null;
  strKit: string | null;
}

export interface Player {
  idPlayer: string;
  idTeam: string | null;
  strPlayer: string;
  strTeam: string | null;
  strPosition: string | null;
  strNationality: string | null;
  strThumb: string | null;
  strCutout: string | null;
  strFanart1: string | null;
  strDescriptionEN: string | null;
  strNumber: string | null;
  strHeight: string | null;
  strWeight: string | null;
  dateBorn: string | null;
  strBirthLocation: string | null;
  strSigning: string | null;
  strWage: string | null;
  strAgent: string | null;
  strInstagram: string | null;
  strTwitter: string | null;
}

export interface Event {
  idEvent: string;
  strLeague: string;
  strHomeTeam: string;
  strAwayTeam: string;
  dateEvent: string | null;
  strTime: string | null;
  intHomeScore: number | null;
  intAwayScore: number | null;
}
