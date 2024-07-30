import { useQuery } from "@tanstack/react-query";

import axios, { endpoints } from "src/utils/axios";

import { Mission } from "src/app/contexts/missions/types";

export const useMission = (missionId:string) => useQuery({
    queryKey:['mission', missionId],
    enabled: !!missionId,
    queryFn: async () => {
      const res = await axios.get(`${endpoints.missions.detail}/${missionId}`);
      return res.data as Mission;
    }
    });