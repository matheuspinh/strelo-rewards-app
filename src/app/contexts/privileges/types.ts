
export type Privilege ={
  id: string;
  title: string;
  description: string;
  xp: number;
  gold: number;
  usersIDs: string[];
  users: {id: string}[];
  requiredBadge: {
    id: string
  };
}

export type PrivilegeList = {
  privileges: Privilege[];
  privilegesCount: number;
}

export type PrivilegeContextType = {
  data: PrivilegeList;
  isLoading: boolean;
  isError: boolean;
  registerPrivilege: (data: any) => Promise<any>;
  updatePrivilege: (data: any) => Promise<any>;
  deletePrivilege: (id: string) => Promise<any>;
}