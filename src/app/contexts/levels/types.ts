export type Level = {
  id: string;
  title: string;
  softSkillsBadges: number;
  hardSkillsBadges: number;
  xpRequired: number;
  goldReward: number;
  previousLevelId: string | null;
  companyId: string;
}

export type LevelsList = Level[]

export type LevelsContextType = {
  data: LevelsList;
  isLoading: boolean;
  isError: boolean;
  registerLevel: (data: any) => Promise<any>;
  levelUpUser: (data: any) => Promise<any>;
}