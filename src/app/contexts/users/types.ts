import { Badge } from "../badges/types";
import { Privilege } from "../privileges/types";

type Mission = {
  id: string,
  title: string
  description: string
  imageUrl: string | null
  xp: number
  gold: number
  completedByIDs: string[]
  completedBy: User[]
  usersIDs: string[]
  companyId: string
  badgesIDs: string[]
  users: User[]
  badges: Badge[]
}

export type User = {
  id: string;
  username: string;
  email: string;
  role: string;
  avatarUrl: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  xp: number;
  gold: number;
  badges: Badge[];
  missions: Mission[];
  completedMissions: Mission[];
  privileges: Privilege[];
}

export type UsersList = {
  users: User[];
  userCount: number;
}

export type UsersContextType = {
  data: UsersList;
  isLoading: boolean;
  isError: boolean;
  registerUser: (data: any) => Promise<any>;
  deleteUser: (id: string) => Promise<any>;
  updateUser: ({id, formData}:{id: string, formData:any}) => Promise<any>;
}