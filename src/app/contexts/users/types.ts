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