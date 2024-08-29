import { Badge } from "../badges/types";

export type Level = {
  id: string;
  title: string;
  softSkillsBadges: number;
  hardSkillsBadges: number;
  xpRequired: number;
  goldReward: number;
  previousLevelId: string | null;
  companyId: string;
  goldHardSkills: number;
  goldSoftSkills: number;
  silverHardSkills: number;
  silverSoftSkills: number;
  specificBadgeId: string | null;
  specificBadge: Badge | null;
}

export type LevelsList = Level[]

export type LevelsContextType = {
  data: LevelsList;
  isLoading: boolean;
  isError: boolean;
  registerLevel: (data: any) => Promise<any>;
  levelUpUser: (data: any) => Promise<any>;
  updateLevel: (data: any) => Promise<any>;
}