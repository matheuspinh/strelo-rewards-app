import { useQuery } from "@tanstack/react-query";

import axios, { endpoints } from "src/utils/axios";

import { User } from "src/app/contexts/users/types";

export const useUser = (userId:string) => useQuery({
    queryKey:['user', userId],
    enabled: !!userId,
    queryFn: async () => {
      const res = await axios.get(`${endpoints.users.detail}${userId}`);
      return res.data as User;
    }})