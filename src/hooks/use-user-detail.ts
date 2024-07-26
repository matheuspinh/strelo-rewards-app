import { useQuery } from "@tanstack/react-query";
import { User } from "src/app/contexts/users/types";
import axios, { endpoints } from "src/utils/axios";

export const useUser = (userId:string) => {
  return useQuery({
    queryKey:['user', userId],
    enabled: !!userId,
    queryFn: async () => {
      const res = await axios.get(`${endpoints.users.detail}${userId}`);
      return res.data as User;
    }})
}