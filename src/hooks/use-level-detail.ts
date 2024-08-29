import { useQuery } from "@tanstack/react-query";

import axios, { endpoints } from "src/utils/axios";

import { Level } from "src/app/contexts/levels/types";

export const useLevel = (levelId: string) => useQuery({
  queryKey: ['levels', levelId],
  enabled: !!levelId,
  queryFn: async () => {
    const res = await axios.get(`${endpoints.levels.detail}/${levelId}`)
    return res.data as Level;
  }
})