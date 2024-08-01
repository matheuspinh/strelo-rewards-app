import { User } from "../users/types"
import { Badge } from "../badges/types"

export type Mission = {
  id: string,
  title: string
  description: string
  imageUrl: string | null
  xp: number
  gold: number
  completedByIDs: string[]
  usersIDs: string[]
  companyId: string
  badgesIDs: string[]
  users: User[]
  badges: Badge[]
}

export type MissionsList = {
  missions: Mission[];
  missionCount: number;
}

export type MissionsContextType= {
  data: MissionsList;
  isLoading: boolean;
  isError: boolean;
  registerMission: (formData: any) => Promise<any>;
  deleteMission: (id: string) => Promise<void>;
  updateMission: ({id, formData}: {id: string, formData: any}) => Promise<void>;
}