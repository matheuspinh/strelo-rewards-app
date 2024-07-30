import { useQuery } from "@tanstack/react-query";
import { Mission } from "src/app/contexts/missions/types";
import axios, { endpoints } from "src/utils/axios";

export const useMission = (missionId:string) => {
  return useQuery({
    queryKey:['mission', missionId],
    enabled: !!missionId,
    queryFn: async () => {
      const res = await axios.get(`${endpoints.missions.detail}/${missionId}`);
      return res.data as Mission;
    }
    })
};