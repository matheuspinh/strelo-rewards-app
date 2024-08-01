import { useQuery } from "@tanstack/react-query";

import axios, { endpoints } from "src/utils/axios";

import { User } from "src/app/contexts/users/types";
import { Privilege } from "src/app/contexts/privileges/types";

export interface PrivilegeDetail extends Privilege {
  users: User[];
}

export const usePrivilege = (privilegeId: string) => useQuery({
  queryKey: ['privilege', privilegeId],
  enabled: !!privilegeId,
  queryFn: async () => {
    const res = await axios.get(`${endpoints.privileges.detail}/${privilegeId}`);
    return res.data as PrivilegeDetail;
  }
})