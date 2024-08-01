import { useQuery } from "@tanstack/react-query";
import { Privilege } from "src/app/contexts/privileges/types";
import axios, { endpoints } from "src/utils/axios";

export const usePrivilege = (privilegeId: string) => useQuery({
  queryKey: ['privilege', privilegeId],
  enabled: !!privilegeId,
  queryFn: async () => {
    const res = await axios.get(`${endpoints.privileges.detail}/${privilegeId}`);
    return res.data as Privilege;
  }
})